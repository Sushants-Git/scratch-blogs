import { CButton } from "@/components/ui/c-button";
import "./App.css";
import { ForwardedRef, useEffect, useRef } from "react";
import ExcalidrawLogo from "./assets/excalidraw-logo.svg?react";
import useBlogStore from "./store";

import { forwardRef } from "react";

import Info from "./components/Info";
import Content from "./components/Content";
import { resizeOnInput } from "./utils";
import ImageUploadButton from "./components/ImageUploadButton";

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
                    <div className="flex justify-end pt-3 font-geist_mono gap-3">
                        <ImageUploadButton />
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

export default App;
