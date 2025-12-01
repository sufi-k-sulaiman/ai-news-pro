import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * SmartTTS - Edge TTS for Deno (Based on your Python/Deno script)
 * Uses Microsoft Edge TTS WebSocket streaming
 */

const VOICES = {
    "en-US-AriaNeural": "Female (US) - Natural & Warm (Default)",
    "en-US-GuyNeural": "Male (US)",
    "en-GB-SoniaNeural": "Female (UK)",
    "en-GB-RyanNeural": "Male (UK)",
    "en-AU-NatashaNeural": "Female (Australia)",
    "en-AU-WilliamNeural": "Male (Australia)",
};

async function textToSpeechEdge(text, voice) {
    const connectionId = crypto.randomUUID().replace(/-/g, "");
    const requestId = crypto.randomUUID().replace(/-/g, "");
    const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4`;
    
    // Escape XML special chars
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${voice}">${escapedText}</voice></speak>`;
    
    const configMsg = `X-RequestId:${connectionId}\r\nPath:speech.config\r\nContent-Type:application/json; charset=utf-8\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
    
    const ttsMsg = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;
    
    return new Promise((resolve, reject) => {
        const chunks = [];
        const ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";
        
        const timeout = setTimeout(() => {
            ws.close();
            reject(new Error("Timeout after 30s"));
        }, 30000);
        
        ws.onopen = () => {
            ws.send(configMsg);
            ws.send(ttsMsg);
        };
        
        ws.onmessage = (msg) => {
            if (msg.data instanceof ArrayBuffer) {
                // Binary audio data
                const data = new Uint8Array(msg.data);
                // Find the header end (after Path:audio\r\n\r\n)
                let headerEnd = -1;
                for (let i = 0; i < data.length - 3; i++) {
                    if (data[i] === 0x0D && data[i+1] === 0x0A && data[i+2] === 0x0D && data[i+3] === 0x0A) {
                        headerEnd = i + 4;
                        break;
                    }
                }
                if (headerEnd > 0 && headerEnd < data.length) {
                    chunks.push(data.slice(headerEnd));
                }
            } else if (typeof msg.data === "string") {
                if (msg.data.includes("Path:turn.end")) {
                    clearTimeout(timeout);
                    ws.close();
                }
            }
        };
        
        ws.onerror = (e) => {
            clearTimeout(timeout);
            reject(new Error("WebSocket error"));
        };
        
        ws.onclose = () => {
            clearTimeout(timeout);
            if (chunks.length === 0) {
                reject(new Error("No audio received"));
                return;
            }
            // Combine all chunks
            const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
            const combined = new Uint8Array(totalLen);
            let offset = 0;
            for (const chunk of chunks) {
                combined.set(chunk, offset);
                offset += chunk.length;
            }
            resolve(combined);
        };
    });
}

// Generate silence (for pauses between paragraphs)
function generateSilence(ms) {
    // MP3 silent frame ~26ms each
    const frames = Math.ceil(ms / 26);
    const frame = new Uint8Array([0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const result = new Uint8Array(frames * frame.length);
    for (let i = 0; i < frames; i++) {
        result.set(frame, i * frame.length);
    }
    return result;
}

function toBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { text, paragraphs: inputParas, voice = "en-US-AriaNeural", pauseMs = 800, listVoices = false } = body;

        if (listVoices) {
            return Response.json({ voices: Object.entries(VOICES).map(([id, desc]) => ({ id, description: desc })) });
        }

        // Split into paragraphs
        const paragraphs = inputParas || (text ? text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(p => p.length > 0) : []);
        
        if (paragraphs.length === 0) {
            return Response.json({ error: "No text provided" }, { status: 400 });
        }

        console.log(`Generating ${paragraphs.length} paragraphs with voice ${voice}...`);

        const segments = [];
        const silence = generateSilence(pauseMs);

        for (let i = 0; i < paragraphs.length; i++) {
            console.log(`Paragraph ${i + 1}/${paragraphs.length}...`);
            const audio = await textToSpeechEdge(paragraphs[i], voice);
            segments.push(audio);
            
            // Add silence between paragraphs (not after last)
            if (i < paragraphs.length - 1) {
                segments.push(silence);
            }
        }

        // Combine all segments
        const totalSize = segments.reduce((acc, seg) => acc + seg.length, 0);
        const fullAudio = new Uint8Array(totalSize);
        let offset = 0;
        for (const seg of segments) {
            fullAudio.set(seg, offset);
            offset += seg.length;
        }

        console.log(`Done! Generated ${totalSize} bytes of MP3 audio.`);

        return Response.json({
            audio: toBase64(fullAudio),
            format: "mp3",
            voice,
            paragraphs: paragraphs.length,
            bytes: totalSize
        });

    } catch (error) {
        console.error("TTS Error:", error.message);
        return Response.json({ error: error.message || "TTS generation failed" }, { status: 500 });
    }
});