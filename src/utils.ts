import { exportToClipboard } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

export const onCopy = async (
    excalidrawAPI: ExcalidrawImperativeAPI | null,
    type: "png" | "svg" | "json",
) => {
    if (!excalidrawAPI) {
        return false;
    }
    await exportToClipboard({
        elements: excalidrawAPI.getSceneElements(),
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
        type,
    });
};

export const resizeOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
};

export const resizeOnToggle = (e: HTMLTextAreaElement) => {
    e.style.height = "auto";
    e.style.height = `${e.scrollHeight}px`;
};
