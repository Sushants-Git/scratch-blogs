import { memo, useEffect, useRef } from "react";
import useBlogStore from "../store";
import { resizeOnInput, resizeOnToggle } from "../utils";

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

export default TextArea;
