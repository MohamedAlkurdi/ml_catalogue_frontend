const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

const handleFinalResults = async (BayesState, setError, setLoading, setBayesState, translation) => {
    const arguments_not_set_error = translation.errors.arguments_not_set
    const request_failed_error = translation.errors.request_failed
    const processing_error = translation.errors.processing_error
    const complete_input_error = translation.errors.complete_input

    if (
        !BayesState.file ||
        !BayesState.selectedTarget ||
        Object.keys(BayesState.savedInput).length === 0
    ) {
        setError({
            status: true,
            message: arguments_not_set_error
        });
        return;
    }
    setLoading(true);

    try {
        const fileContent = await BayesState.file.text();
        const targetIndex = BayesState.columns.findIndex(
            (col) => col.name === BayesState.selectedTarget
        );
        const requestBody = {
            file_content: fileContent,
            target_index: targetIndex,
            test_point: BayesState.savedInput,
        };
        if (
            Object.keys(BayesState.savedInput).length !==
            BayesState.columns.length - 1
        ) {
            setError({ status: true, message: complete_input_error });
        }

        const response = await fetch(`${BACKEND_URL}/bayes/process-csv/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            setLoading(false);
            setError({ status: true, message: `${request_failed_error} ${response.status}` })
            return;
        }

        const result = await response.json();
        console.log("Bayes Classifier Result:", result.result.probs);
        setBayesState((prevState) => ({ ...prevState, results: result }));
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