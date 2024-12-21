import { CButton } from "@/components/ui/c-button";
import useBlogStore from "../store";

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

export default Info;
