import { CButton } from "@/components/ui/c-button";
import "./App.css";
import { ForwardedRef, memo, useEffect, useRef, useState } from "react";
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
                <CButton size="icon">
                    <AiLogo className="h-10" />
                </CButton>

                {
                    // <CButton onClick={() => { onCopy(excalidrawAPI, "png") }}> Copy as png </CButton>
                }

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

const Content = () => {
    const contentArray = useBlogStore((state) => state.content);
    const mode = useBlogStore((state) => state.mode);

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
        <div>
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
