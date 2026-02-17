import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

fal.config({ credentials: process.env.FAL_KEY });

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();

    const memePrompt = `meme style, internet humor, funny, viral reddit meme, ${prompt}, white space for caption text at top and bottom, high contrast, bold visual`;

    try {
        const result = await fal.subscribe("fal-ai/flux/dev", {
            input: {
                prompt: memePrompt,
                image_size: "square_hd",
                num_inference_steps: 28,
                guidance_scale: 3.5,
                num_images: 1,
                enable_safety_checker: true,
            },
        });

        return NextResponse.json({
            imageUrl: (result.data as { images: { url: string }[] }).images[0].url,
        });
    } catch (error) {
        console.error("fal.ai generation error:", error);
        return NextResponse.json(
            { error: "Generation failed" },
            { status: 500 }
        );
    }
}
