import { CButton } from "@/components/ui/c-button";
import { createPortal } from "react-dom";

const ContentModal = ({
    isOpen,
    onClose,
    content,
    onContentChange,
    onTake,
}: {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    onContentChange: (content: string) => void;
    onTake: () => void;
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-geist_mono">
            <div className="bg-white rounded-sm p-6 w-3/4 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">
                    Generated Content
                </h2>
                <textarea
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="w-full h-72 border border-gray-300 p-2 resize-none focus:outline-none text-sm"
                />
                <div className="mt-4 flex justify-end gap-4">
                    <CButton variant="secondary" onClick={onClose}>
                        Close
                    </CButton>
                    <CButton onClick={onTake}>Take</CButton>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ContentModal;
