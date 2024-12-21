import React from "react";
import ImageLogo from "../assets/image-logo.svg?react";
import { CButton } from "@/components/ui/c-button";
import useBlogStore from "../store";

const ImageUploadButton = () => {
    const appendContent = useBlogStore((state) => state.appendContent);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (file) {
            appendContent(URL.createObjectURL(file), "image", file);
        }
    };

    return (
        <CButton variant="secondary">
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
                id="imageUploadInput"
            />
            <label htmlFor="imageUploadInput" style={{ cursor: "pointer" }}>
                <ImageLogo />
            </label>
        </CButton>
    );
};

export default ImageUploadButton;
