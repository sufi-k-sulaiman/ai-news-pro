import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, voice = 'en-US-AriaNeural' } = await req.json();
        
        if (!text) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        // Edge TTS WebSocket endpoint
        const wsUrl = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4';
        
        // Generate unique request ID
        const requestId = crypto.randomUUID().replace(/-/g, '');
        
        // SSML configuration
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
            <voice name='${voice}'>
                <prosody pitch='+0Hz' rate='+0%' volume='+0%'>
                    ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </prosody>
            </voice>
        </speak>`;

        // Connect to Edge TTS WebSocket
        const ws = new WebSocket(wsUrl);
        
        const audioChunks = [];
        
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('TTS timeout'));
            }, 60000);

            ws.onopen = () => {
                // Send config message
                const configMessage = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
                ws.send(configMessage);
                
                // Send SSML message
                const ssmlMessage = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${ssml}`;
                ws.send(ssmlMessage);
            };

            ws.onmessage = (event) => {
                if (event.data instanceof Blob) {
                    // Binary audio data
                    event.data.arrayBuffer().then(buffer => {
                        const uint8Array = new Uint8Array(buffer);
                        // Find the audio data after the header (search for "Path:audio")
                        const headerEnd = findHeaderEnd(uint8Array);
                        if (headerEnd > 0) {
                            audioChunks.push(uint8Array.slice(headerEnd));
                        }
                    });
                } else if (typeof event.data === 'string') {
                    if (event.data.includes('Path:turn.end')) {
                        clearTimeout(timeout);
                        ws.close();
                        resolve();
                    }
                }
            };

            ws.onerror = (error) => {
                clearTimeout(timeout);
                reject(error);
            };

            ws.onclose = () => {
                clearTimeout(timeout);
                resolve();
            };
        });

        // Combine audio chunks
        const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const combinedAudio = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of audioChunks) {
            combinedAudio.set(chunk, offset);
            offset += chunk.length;
        }

        // Convert to base64
        const base64Audio = btoa(String.fromCharCode(...combinedAudio));

        return Response.json({ 
            audio: base64Audio,
            format: 'mp3',
            voice: voice
        });

    } catch (error) {
        console.error('Edge TTS error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

// Helper to find where audio data starts after headers
function findHeaderEnd(data) {
    // Look for double CRLF which marks end of headers
    for (let i = 0; i < data.length - 3; i++) {
        if (data[i] === 0x0D && data[i+1] === 0x0A && data[i+2] === 0x0D && data[i+3] === 0x0A) {
            return i + 4;
        }
    }
    // Alternative: look for "Path:audio" header pattern
    const pathAudio = [0x50, 0x61, 0x74, 0x68, 0x3A, 0x61, 0x75, 0x64, 0x69, 0x6F]; // "Path:audio"
    for (let i = 0; i < data.length - pathAudio.length; i++) {
        let found = true;
        for (let j = 0; j < pathAudio.length; j++) {
            if (data[i + j] !== pathAudio[j]) {
                found = false;
                break;
            }
        }
        if (found) {
            // Find the next CRLF CRLF after this
            for (let k = i + pathAudio.length; k < data.length - 3; k++) {
                if (data[k] === 0x0D && data[k+1] === 0x0A) {
                    return k + 2;
                }
            }
        }
    }
    return 0;
}