import { CButton } from "@/components/ui/c-button";
import ContentModal from "./ContentModal";
import AiLogo from "../assets/ai-logo.svg?react";
import dedent from "dedent";
import useBlogStore from "../store";

import { useState } from "react";

const AiImageButton = ({ data, id }: { data: string; id: string }) => {
    const [generatedContent, setGeneratedContent] = useState<string | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const putGeneratedContent = useBlogStore(
        (state) => state.putGeneratedContent,
    );
    const title = useBlogStore((state) => state.title);

    const handleClick = async () => {
        try {
            setIsLoading(true);
            await copyImageToClipboard(data);

            const clipboardItems = await navigator.clipboard.read();

            for (const clipboardItem of clipboardItems) {
                const imageTypes = clipboardItem.types.filter((type) =>
                    type.startsWith("image/"),
                );
                if (imageTypes.length > 0) {
                    const blob = await clipboardItem.getType(imageTypes[0]);

                    const formData = new FormData();
                    formData.append("file", blob);

                    formData.append(
                        "prompt",
                        dedent`
I am writing a blog post about ${title ? title : "the subject of this image"}, and I need your help crafting the content. This blog incorporates images throughout, and I will provide one of these images for you to write about. 

Since this image appears in the **middle of the blog**, ensure the content reflects its placement—it should neither sound like the introduction nor the conclusion. Focus on maintaining a natural flow as if continuing a discussion.

The image is provided below. Please write engaging content based on it, using a good amount of **Markdown formatting** for structure and readability.

- use a good amount of **Markdown formatting** for structure and readability
- do not use html
- there is no need to include the image in the content
    `,
                    );

                    const response = await fetch(
                        import.meta.env.VITE_BACKEND_URL + "/upload",
                        {
                            method: "POST",
                            body: formData,
                        },
                    );

                    if (!response.ok) {
                        throw new Error("Failed to upload image");
                    }

                    const data = await response.json();
                    setGeneratedContent(data.blog);
                    setIsModalOpen(true);
                    console.log("Upload successful:", data);
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTake = () => {
        putGeneratedContent(generatedContent || "", "text", id);
        console.log("Taking content:", generatedContent);
        setIsModalOpen(false);
    };

    const handleClose = () => setIsModalOpen(false);

    const handleContentChange = (content: string) => {
        setGeneratedContent(content);
    };

    return (
        <>
            <CButton
                size="icon"
                onClick={handleClick}
                disabled={isLoading}
                className="relative w-10 h-10"
            >
                {isLoading ? (
                    <div className="animate-spin w-5 h-5 rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                    <AiLogo className="h-10" />
                )}
            </CButton>
            <ContentModal
                isOpen={isModalOpen}
                onClose={handleClose}
                content={generatedContent || ""}
                onContentChange={handleContentChange}
                onTake={handleTake}
            />
        </>
    );
};

const copyImageToClipboard = async (imageUrl: string) => {
    try {
        const img = new Image();
        img.src = imageUrl;
        img.onload = async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        await navigator.clipboard.write([
                            new ClipboardItem({ "image/png": blob }),
                        ]);
                    }
                }, "image/png");
            }
        };
    } catch (err) {
        console.error("Failed to copy image to clipboard", err);
    }
};

export default AiImageButton;