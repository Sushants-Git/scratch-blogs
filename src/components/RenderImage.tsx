import AiImageButton from "./AiImageButton";
import { CButton } from "@/components/ui/c-button";
import { X } from "lucide-react";
import useBlogStore from "../store";

const RenderImage = ({ id, data }: { id: string; data: string }) => {
    const removeContent = useBlogStore((state) => state.removeContent);

    return (
        <div className="pb-5">
            <div className="flex justify-between pb-2">
                <AiImageButton data={data} id={id} />
                <CButton
                    variant="ghost"
                    size="icon"
                    className="border"
                    onClick={() => removeContent(id)}
                >
                    <X className="h-4 w-4" />
                </CButton>
            </div>
            <div className="flex justify-center border-2 p-2 rounded-md">
                <img src={data} alt={data} className="max-h-[400px]" />
            </div>
        </div>
    );
};

export default RenderImage;
