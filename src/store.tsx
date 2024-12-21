import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export interface BlogState {
    mode: "edit" | "preview";
    title: string;
    content: {
        id: string;
        data: string | readonly ExcalidrawElement[];
        type: "text" | "image" | "diagram";
    }[];
    setTitle: (title: string) => void;
    appendContent: (
        data: string | readonly ExcalidrawElement[],
        type: "text" | "image" | "diagram",
    ) => void;
    updateContent: (id: string, data: string | ExcalidrawElement[]) => void;
    removeContent: (id: string) => void;
    putGeneratedContent: (data: string, type: "text", id: string) => void;
    toggleMode: (mode: BlogState["mode"]) => void;
}

const useBlogStore = create<BlogState>()((set) => ({
    mode: "edit",
    title: "",
    content: [{ id: uuidv4(), data: "", type: "text" }],
    setTitle: (title) => {
        set(() => ({
            title,
        }));
    },
    appendContent: (data, type) => {
        set((state) => ({
            content: [...state.content, { id: uuidv4(), data, type }],
        }));
    },
    updateContent: (id, data) => {
        set((state) => ({
            content: state.content.map((content) =>
                content.id === id ? { ...content, data } : content,
            ),
        }));
    },
    removeContent: (id) => {
        set((state) => {
            const index = state.content.findIndex(
                (content) => content.id === id,
            );

            const nextContent = state.content[index + 1];
            if (
                nextContent &&
                nextContent.type === "text" &&
                nextContent.data === ""
            ) {
                return {
                    content: state.content.filter(
                        (content) =>
                            content.id !== id && content.id !== nextContent.id,
                    ),
                };
            }

            return {
                content: state.content.filter((content) => content.id !== id),
            };
        });
    },
    putGeneratedContent: (data, type, id) => {
        set((state) => {
            const index = state.content.findIndex(
                (content) => content.id === id,
            );
            return {
                content: [
                    ...state.content.slice(0, index + 1),
                    { id: uuidv4(), data, type },
                    ...state.content.slice(index + 2),
                ],
            };
        });
    },
    toggleMode: (mode: BlogState["mode"]) => {
        set(() => ({ mode }));
    },
}));

export default useBlogStore;
