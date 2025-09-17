const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

const handleFinalResults = async (DTState, setError, setLoading, setDTState, translation) => {

    const arguments_not_set_error = translation.errors.arguments_not_set
    const request_failed_error = translation.errors.request_failed
    const processing_error = translation.errors.processing_error


    if (
        !DTState.file || !DTState.selectedTarget) {
        setError({
            status: true,
            message:arguments_not_set_error
        });
        return;
    }
    setLoading(true);

    try {
        const fileContent = await DTState.file.text();
        const targetIndex = DTState.columns.findIndex(
            (col) => col.name === DTState.selectedTarget
        );
        const requestBody = {
            file_content: fileContent,
            target_index: targetIndex,
        };
        const response = await fetch(`${BACKEND_URL}/dt/data_process/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            setLoading(false);
            setError({status:true, message:`${request_failed_error} ${response.status}`})
            return;
        }

        const result = await response.json();
        console.log("Decision Trees Result:", result);
        setDTState((prevState) => ({ ...prevState, results: result }));
        setLoading(false);
    } catch (error) {
        setError({status:true, message:processing_error})
        setLoading(false);
        return;
    }
};

export {
    handleFinalResults,
}