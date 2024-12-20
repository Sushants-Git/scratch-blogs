import { CButton } from "@/components/ui/c-button";
import "./App.css";
import { useEffect, useRef } from "react";

function App() {
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

    const resizeOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    };

    return (
        <div className="bg-[#FAFAFA]">
            <main className="border-l border-r w-3/4 md:w-2/3 min-h-screen mx-auto border-c_gray bg-white">
                <header className="border-b py-3 text-sm font-medium px-7 flex justify-between items-center">
                    <h1>Sushant Mishra's Blogs</h1>
                    <div className="flex gap-4">
                        <CButton>Edit</CButton>
                        <CButton variant="secondary">Preview</CButton>
                    </div>
                </header>
                <article className="px-7">
                    <section className="pt-12">
                        <textarea
                            ref={titleRef}
                            placeholder="Article Title..."
                            className="text-2xl md:text-3xl font-geist font-[600] bg-transparent border-none w-full focus:outline-none resize-none"
                            rows={1}
                            onInput={resizeOnInput}
                        ></textarea>
                    </section>
                    <section className="pt-6">
                        <textarea
                            ref={contentRef}
                            placeholder="Create something new ..."
                            className="bg-transparent border-none w-full focus:outline-none resize-none"
                            spellCheck="false"
                            onInput={resizeOnInput}
                        ></textarea>
                    </section>
                </article>
            </main>
        </div>
    );
}

export default App;
