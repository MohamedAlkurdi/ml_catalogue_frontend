import { useState } from "react";
import DataTable from "./DataTable";
import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";

export default function DataUploader({ url, handleFileChange, stateSetter, algorithmState, handleUpload, setError }) {
    // const [exampleFiles] = useState(["generic_dataset.csv", "weather.csv"]);
    const [exampleFiles] = useState(["example.csv"]);
    const [isLoadingExample, setIsLoadingExample] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

    const locale = useLocale()
    const translation = useTranslation(locale)
    const file_load_error_message = translation.errors.data_uploader_errors.file_load_error
    const use_word = translation.data_uploader.use
    const upload_preview = translation.data_uploader.upload_preview
    const uploading_word = translation.data_uploader.uploading

    console.log("backend url from data uploader:", BACKEND_URL)

    const handleExampleSelect = async (filename) => {
        setIsLoadingExample(true);
        try {
            const response = await fetch(`${BACKEND_URL}/examples/${filename}`); // example file request
            
            if (response.ok) {
                const data = await response.text();
                const file = new File([data], filename, { type: "text/csv" });

                console.log("loaded example file:", file);
                console.log("request url from data uploader:", `${BACKEND_URL}/examples/${filename}`);

                stateSetter((prevState) => ({
                    ...prevState,
                    file: file,
                    preview: null
                }));
            } else {
                throw new Error(`Failed to load example file: ${response.status}`);
            }

        } catch (error) {
            console.error(file_load_error_message, error);
            setError(file_load_error_message);
        } finally {
            setIsLoadingExample(false);
        }
    };

    const handleUploadClick = async () => {
        setIsUploading(true);
        try {
            await handleUpload(url, stateSetter, algorithmState, setError, translation);
        } finally {
            setIsUploading(false);
        }
    };

    const hasFile = algorithmState.file !== null && algorithmState.file !== undefined;
    const isButtonDisabled = !hasFile || isLoadingExample || isUploading;

    // Button text based on state
    const getButtonText = () => {
        if (isUploading) return uploading_word;
        if (isLoadingExample) return uploading_word;
        return upload_preview;
    };

    return (
        <div className={`flex flex-col gap-4 card-bg ${locale === 'en' || locale === 'tr' ? `ltr` : 'rtl'}`}>
            <div className="flex max-sm:flex-col max-sm:gap-6 justify-between items-center">
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileChange(e, stateSetter, setError)}
                    className="block text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:text-secondary file:bg-btn file:cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 max-sm:w-full">
                    {exampleFiles.map((file) => (
                        <button
                            key={file} 
                            onClick={() => handleExampleSelect(file)}
                            disabled={isLoadingExample || isUploading}
                            className={`btn ${locale === 'en' || locale === 'tr' ? `ltr` : 'rtl'} ${(isLoadingExample || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoadingExample ? "Loading..." : `${use_word} ${file}`}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleUploadClick}
                disabled={isButtonDisabled}
                className={`btn ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {getButtonText()}
            </button>

            {algorithmState.preview && (
                <div className="mt-6">
                    <DataTable data={algorithmState.preview} rowsToDisplay={5} />
                </div>
            )}
        </div>
    );
}