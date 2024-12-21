import { CButton } from "@/components/ui/c-button";
import "./App.css";
import {
    ForwardedRef,
    memo,
    useEffect,
    useRef,
    useState,
} from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import ExcalidrawLogo from "./assets/excalidraw-logo.svg?react";
import AiLogo from "./assets/ai-logo.svg?react";
import useBlogStore from "./store";

import { forwardRef } from "react";
import Markdown from "react-markdown";
import { X } from "lucide-react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { onCopy } from "./utils";
import { createPortal } from "react-dom";

import dedent from "dedent";

const resizeOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
};

const resizeOnToggle = (e: HTMLTextAreaElement) => {
    e.style.height = "auto";
    e.style.height = `${e.scrollHeight}px`;
};

function App() {
    return <Blog />;
}

function Blog() {
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    const contentRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (titleRef.current) {
                titleRef.current.style.height = "auto";
                titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
            }

            if (contentRef.current) {
                contentRef.current.style.height = "auto";
                contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const appendContent = useBlogStore((state) => state.appendContent);

    return (
        <div className="bg-smoke">
            <main className="border-l border-r w-3/4 md:w-2/3 min-h-screen mx-auto border-c_gray bg-white">
                <header className="border-b py-3 text-sm font-medium px-7 flex justify-between items-center font-geist_mono">
                    <Info />
                </header>
                <article className="px-7">
                    <div className="flex justify-end pt-3 font-geist_mono">
                        <CButton
                            variant={"secondary"}
                            onClick={() => {
                                appendContent([], "diagram");
                                appendContent("", "text");
                            }}
                        >
                            <ExcalidrawLogo />
                        </CButton>
                    </div>
                    <section className="pt-12">
                        <Title ref={titleRef} />
                    </section>
                    <section className="pt-4">
                        <Content />
                    </section>
                </article>
            </main>
        </div>
    );
}

function Info() {
    const mode = useBlogStore((state) => state.mode);
    const toggleMode = useBlogStore((state) => state.toggleMode);

    const isEdit = mode === "edit";

    return (
        <>
            <h1>Sushant Mishra's Blogs</h1>
            <div className="flex gap-4">
                <CButton
                    variant={isEdit ? "default" : "secondary"}
                    onClick={() => toggleMode("edit")}
                >
                    Edit
                </CButton>
                <CButton
                    variant={!isEdit ? "default" : "secondary"}
                    onClick={() => toggleMode("preview")}
                >
                    Preview
                </CButton>
            </div>
        </>
    );
}

const Title = forwardRef((_, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const title = useBlogStore((state) => state.title);
    const changeTitle = useBlogStore((state) => state.setTitle);

    return (
        <textarea
            ref={ref}
            placeholder="Article Title..."
            className="text-2xl md:text-3xl font-geist font-[600] bg-transparent border-none w-full focus:outline-none resize-none"
            rows={1}
            spellCheck="false"
            onInput={resizeOnInput}
            value={title}
            onChange={(e) => changeTitle(e.currentTarget.value)}
        ></textarea>
    );
});

const RenderDiagram = ({
    id,
    data,
}: {
    id: string;
    data: readonly ExcalidrawElement[];
}) => {
    const [excalidrawAPI, setExcalidrawAPI] =
        useState<ExcalidrawImperativeAPI | null>(null);
    const removeContent = useBlogStore((state) => state.removeContent);

    return (
        <div className="pb-5">
            <div className="flex justify-between pb-2">
                <AiButton excalidrawAPI={excalidrawAPI} id={id} />
                <CButton
                    variant="ghost"
                    size="icon"
                    className="border"
                    onClick={() => removeContent(id)}
                >
                    <X className="h-4 w-4" />
                </CButton>
            </div>
            <div
                style={{ height: "600px" }}
                className="border-2 p-2 rounded-md"
            >
                <Excalidraw
                    initialData={{ elements: data }}
                    excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
                        setExcalidrawAPI(api)
                    }
                />
            </div>
        </div>
    );
};

const Modal = ({
    isOpen,
    onClose,
    content,
    onContentChange,
    onTake,
}: {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    onContentChange: (content: string) => void;
    onTake: () => void;
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-geist_mono">
            <div className="bg-white rounded-sm p-6 w-3/4 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">
                    Generated Content
                </h2>
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="w-full h-72 border border-gray-300 p-2 resize-none focus:outline-none text-sm"
                />
                <div className="mt-4 flex justify-end gap-4">
                    <CButton variant="secondary" onClick={onClose}>
                        Close
                    </CButton>
                    <CButton onClick={onTake}>Take</CButton>
                </div>
            </div>
        </div>,
        document.body,
    );
};

const AiButton = ({
    excalidrawAPI,
    id,
}: {
    excalidrawAPI: ExcalidrawImperativeAPI | null;
    id: string;
}) => {
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
            await onCopy(excalidrawAPI, "png");

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
            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                content={generatedContent || ""}
                onContentChange={handleContentChange}
                onTake={handleTake}
            />
        </>
    );
};

const Content = () => {
    const contentArray = useBlogStore((state) => state.content);
    const mode = useBlogStore((state) => state.mode);

    const containerRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     const container = containerRef.current;
    //     if(!container) return;

    //     const scrollPosition = container.scrollTop;

    //     return () => {
    //         container.scrollTop = scrollPosition;
    //     };
    // });

    const renderImage = (data: string) => (
        <pre>
            `![${data}](${data})`
        </pre>
    );

    const renderContent = (content: {
        id: string;
        type: string;
        data: string | readonly ExcalidrawElement[];
    }) => {
        const uniqueKey = `${content.id}-${content.type}`;

        if (
            mode === "preview" &&
            content.type === "text" &&
            typeof content.data === "string"
        ) {
            return (
                <Markdown key={uniqueKey} className="mb-2">
                    {content.data}
                </Markdown>
            );
        }

        switch (content.type) {
            case "text":
                if (typeof content.data === "string") {
                    return (
                        <TextArea
                            key={uniqueKey}
                            data={content.data}
                            id={content.id}
                        />
                    );
                } else {
                    return null;
                }
            case "image":
                if (typeof content.data === "string") {
                    return (
                        <div key={uniqueKey}>{renderImage(content.data)}</div>
                    );
                } else {
                    return null;
                }
            case "diagram":
                if (Array.isArray(content.data)) {
                    return (
                        <div key={uniqueKey}>
                            <RenderDiagram
                                id={content.id}
                                data={content.data}
                            />
                        </div>
                    );
                } else {
                    return null;
                }
            default:
                return null;
        }
    };

    return (
        <div ref={containerRef}>
            <section className={mode === "preview" ? "markdown-wrapper" : ""}>
                {contentArray.map(renderContent)}
            </section>
        </div>
    );
};

const TextArea = memo(({ id, data }: { id: string; data: string }) => {
    const updateContent = useBlogStore((state) => state.updateContent);
    const mode = useBlogStore((state) => state.mode);
    const ref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (
            mode === "edit" &&
            ref &&
            typeof ref !== "function" &&
            ref.current
        ) {
            resizeOnToggle(ref.current);
        }
    }, [mode, ref]);

    return (
        <textarea
            ref={ref}
            placeholder="Create something new ..."
            className="bg-transparent border-none w-full focus:outline-none resize-none font-geist_mono text-sm mb-2"
            spellCheck="false"
            onInput={resizeOnInput}
            value={data}
            onChange={(e) => updateContent(id, e.currentTarget.value)}
        ></textarea>
    );
});

export default App;
