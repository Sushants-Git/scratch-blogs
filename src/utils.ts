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
