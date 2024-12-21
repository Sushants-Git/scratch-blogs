import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { useRef } from "react";
import Markdown from "react-markdown";
import useBlogStore from "../store";
import RenderDiagram from "./RenderDiagram";
import TextArea from "./TextArea";
import RenderImage from "./RenderImage";

const Content = () => {
    const contentArray = useBlogStore((state) => state.content);
    const mode = useBlogStore((state) => state.mode);

    const containerRef = useRef<HTMLDivElement | null>(null);

    // const renderImage = (data: string) => (
    //     <div className="flex justify-center border-2 p-2 rounded-md">
    //         <img src={data} alt={data} className="w-[400px] h-[400px]" />
    //     </div>
    // );

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
                        <div key={uniqueKey}>
                            {
                                <RenderImage
                                    data={content.data}
                                    id={content.id}
                                />
                            }
                        </div>
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

export default Content;
