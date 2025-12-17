import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { articles } = await req.json();
        
        if (!articles || !Array.isArray(articles)) {
            return Response.json({ error: 'Invalid articles array' }, { status: 400 });
        }
        
        // Generate 8 images for first page in parallel
        const maxImages = Math.min(articles.length, 8);
        
        const imagePromises = articles.slice(0, maxImages).map(async (article) => {
            const cleanTitle = article.title
                .replace(/<[^>]*>/g, '')
                .replace(/&[^;]+;/g, ' ')
                .replace(/https?:\/\/[^\s]+/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            try {
                const result = await base44.integrations.Core.GenerateImage({
                    prompt: `Professional news photography depicting: ${cleanTitle}. Photorealistic, editorial style, high quality, no text or words, no logos`
                });
                return result?.url || null;
            } catch (error) {
                console.error('Image generation failed:', error);
                return null;
            }
        });
        
        const results = await Promise.all(imagePromises);
        
        return Response.json({ images: results });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});