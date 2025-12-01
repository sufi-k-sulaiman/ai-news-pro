import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Use Web Speech Synthesis via ttsmp3.com API
async function generateTTS(text, lang = "en-gb") {
    // Map to ttsmp3 language codes
    const langMap = {
        'en-gb': 'Brian',      // British male
        'en-us': 'Matthew',    // American male
        'en-au': 'Russell',    // Australian male
        'en-za': 'Brian'       // British (closest)
    };
    
    const voice = langMap[lang] || 'Brian';
    
    // ttsmp3.com accepts longer text
    const maxLen = 3000;
    const chunks = [];
    
    let remaining = text;
    while (remaining.length > 0) {
        let chunk = remaining.substring(0, maxLen);
        if (remaining.length > maxLen) {
            const lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > 500) {
                chunk = remaining.substring(0, lastSpace);
            }
        }
        chunks.push(chunk.trim());
        remaining = remaining.substring(chunk.length).trim();
    }

    const audioChunks = [];
    
    for (const chunk of chunks) {
        if (!chunk) continue;
        
        console.log(`Fetching TTS for chunk (${chunk.length} chars)...`);
        
        // Use ttsmp3.com API
        const formData = new URLSearchParams();
        formData.append('msg', chunk);
        formData.append('lang', voice);
        formData.append('source', 'ttsmp3');
        
        const response = await fetch('https://ttsmp3.com/makemp3_new.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        
        if (!response.ok) {
            console.error(`ttsmp3 failed: ${response.status}`);
            throw new Error(`TTS service error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.URL) {
            console.error('No URL in response:', result);
            throw new Error('TTS generation failed');
        }
        
        // Fetch the actual audio file
        const audioResponse = await fetch(result.URL);
        if (!audioResponse.ok) {
            throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }
        
        const buffer = await audioResponse.arrayBuffer();
        audioChunks.push(new Uint8Array(buffer));
    }

    if (audioChunks.length === 0) {
        throw new Error('No audio generated');
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

        const audio = await generateTTS(text, lang);
        
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