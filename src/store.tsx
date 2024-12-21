import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface BlogState {
    mode: "edit" | "preview";
    title: string;
    content: {
        id: string;
        data: string;
        type: "text" | "image" | "diagram";
    }[];
    setTitle: (title: string) => void;
    appendContent: (data: string, type: "text" | "image" | "diagram") => void;
    updateContent: (id: string, data: string) => void;
    removeContent: (id: string) => void;
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
    toggleMode: (mode: BlogState["mode"]) => {
        set(() => ({ mode }));
    },
}));

export default useBlogStore;