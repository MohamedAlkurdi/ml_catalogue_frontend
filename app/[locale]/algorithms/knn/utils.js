const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

const handleFinalResults = async (knnState, setError, setLoading, setKnnState, translation) => {

    const arguments_not_set_error = translation.errors.arguments_not_set
    const request_failed_error = translation.errors.request_failed
    const processing_error = translation.errors.processing_error
    const complete_input_error = translation.errors.complete_input


    if (
        !knnState.file ||
        !knnState.selectedTarget ||
        Object.keys(knnState.savedInput).length === 0
    ) {

        setError({
            status: true,
            message: arguments_not_set_error
        });
        return
    }
    setLoading(true);

    try {
        const fileContent = await knnState.file.text();
        const targetIndex = knnState.columns.findIndex(
            (col) => col.name === knnState.selectedTarget
        );
        const requestBody = {
            file_content: fileContent,
            target_index: targetIndex,
            test_point: knnState.savedInput,
        };
        if (
            Object.keys(knnState.savedInput).length !==
            knnState.columns.length - 1
        ) {
            setError({ status: true, message: complete_input_error });
            throw new Error("complete the input.");
        }
        console.log(
            "knnState.savedInput.length: ",
            Object.keys(knnState.savedInput).length
        );
        console.log("knnState.columns.length: ", knnState.columns.length);

        const response = await fetch(`${BACKEND_URL}/knn/process-csv/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            setLoading(false);
            setError({ status: true, message: "" })
            throw new Error(`${request_failed_error}} ${response.status}`);
        }

        const result = await response.json();
        console.log("Prediction Result:", result);
        setKnnState((prevState) => ({ ...prevState, results: result }));
        setLoading(false);
    } catch (error) {
        console.log("Error processing CSV:", error);
        setError({ status: true, message: processing_error })
        setLoading(false);
        return;
    }
};

export {
    handleFinalResults,
}