import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import AiButton from "./AiButton";
import { CButton } from "@/components/ui/c-button";
import { X } from "lucide-react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useState } from "react";
import useBlogStore from "../store";

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

export default RenderDiagram;
