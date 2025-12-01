import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Use VoiceRSS TTS (free tier available)
async function voiceRSSTTS(text, lang = "en-gb") {
    // Map our lang codes to VoiceRSS format
    const langMap = {
        'en-gb': 'en-gb',
        'en-us': 'en-us',
        'en-au': 'en-au',
        'en-za': 'en-za'
    };
    
    const voiceLang = langMap[lang] || 'en-gb';
    
    // Split text into chunks (VoiceRSS has limits)
    const maxLen = 500;
    const chunks = [];
    
    let remaining = text;
    while (remaining.length > 0) {
        let chunk = remaining.substring(0, maxLen);
        if (remaining.length > maxLen) {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > 100) {
                chunk = remaining.substring(0, lastSpace);
            }
        }
        chunks.push(chunk.trim());
        remaining = remaining.substring(chunk.length).trim();
    }

    const audioChunks = [];
    
    for (const chunk of chunks) {
        // Using StreamElements TTS API (free, reliable)
        const url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(chunk)}`;
        
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });
        
        if (!response.ok) {
            // Fallback to another TTS service
            const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${voiceLang.split('-')[0]}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
            const fallbackResponse = await fetch(fallbackUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
            });
            
            if (!fallbackResponse.ok) {
                throw new Error(`TTS failed: ${response.status}`);
            }
            
            const buffer = await fallbackResponse.arrayBuffer();
            audioChunks.push(new Uint8Array(buffer));
        } else {
            const buffer = await response.arrayBuffer();
            audioChunks.push(new Uint8Array(buffer));
        }
    }

    // Combine all chunks
    const totalLength = audioChunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    
    return result;
}

// Convert Uint8Array to base64
function toBase64(bytes) {
    let binary = "";
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
        const { text, lang = "en" } = body;

        if (!text) {
            return Response.json({ error: "No text provided" }, { status: 400 });
        }

        console.log(`Generating TTS for ${text.length} chars with lang: ${lang}`);

        const audio = await voiceRSSTTS(text, lang);
        
        console.log(`Generated ${audio.length} bytes`);

        return Response.json({
            audio: toBase64(audio),
            format: "mp3",
            bytes: audio.length
        });

    } catch (error) {
        console.error("TTS Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});