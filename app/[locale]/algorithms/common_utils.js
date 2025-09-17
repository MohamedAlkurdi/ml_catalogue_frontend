const handleFileChange = (e, stateSetter) => {
    console.log("here is the uploaded file:", e.target.files[0]);
    stateSetter((prevState) => ({ ...prevState, file: e.target.files[0] }));
};

const handleUpload = async (url, stateSetter, algorithmState, setError, translation) => {
    const upload_csv_error = translation.errors.upload_csv_error
    console.log("request to url:", url)
    if (!algorithmState.file) {
        setError({ status: true, message: upload_csv_error })
        return;
    }

    const form = new FormData();
    form.append("file", algorithmState.file);

    const res = await fetch(url, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        setError({ status: true, message: "Upload failed due to a server error." })
        return;
    }

    const data = await res.json();
    stateSetter((prevState) => ({ ...prevState, preview: data }));
    stateSetter((prevState) => ({ ...prevState, selectedTarget: null }));
    stateSetter((prevState) => ({ ...prevState, results: null }));
    stateSetter((prevState) => ({ ...prevState, savedInput: {} }));
};

const handleTargetSelection = (e, stateSetter) => {
    stateSetter((prevState) => ({
        ...prevState,
        selectedTarget: e.target.innerText,
    }));
    console.log("selected: ", e.target.innerText);
};

const generateInput = (algorithmState, stateSetter, pythonToJsType, setError, translation) => {
    const input_generation_failed = translation.errors.input_generation_failed
    if (
        !algorithmState.preview &&
        !algorithmState.preview.preview &&
        !algorithmState.columns
    ) {
        setError({ status: true, message: input_generation_failed })
        return;
    }

    const numRows = algorithmState.preview.preview.length;
    const generated = {};

    console.log("selected target:", algorithmState.selectedTarget);
    console.log("columns:", algorithmState.columns);
    console.log("preview:", algorithmState.preview.preview);

    algorithmState.columns.forEach((col) => {
        if (
            algorithmState.selectedTarget !== null &&
            col.name === algorithmState.selectedTarget
        ) {
            console.log("Skipping target column:", col.name);
            return;
        }

        console.log("from generateInput, col:", col);
        console.log("from generateInput, col:", col.type);

        if (pythonToJsType[col.type] === "number") {
            var bound1 = Math.floor(Math.random() * numRows);
            var bound2 = Math.floor(Math.random() * numRows);
            if (bound1 === bound2) {
                bound2++;
            }
            const start = Math.min(bound1, bound2);
            const end = Math.max(bound1, bound2);

            const slicedData = algorithmState.preview.preview
                .slice(start, end)
                .map((row) => row[col.name]);
            const average =
                slicedData.reduce((sum, val) => sum + val, 0) / slicedData.length;
            if (col.type === "int64") {
                generated[col.name] = Math.round(average) || 0;
                return;
            }
            generated[col.name] = average || 0;
            console.log("Generated value for column (number):", col.name, average);
        } else if (pythonToJsType[col.type] === "text") {
            const randomIndex = Math.floor(Math.random() * numRows);
            generated[col.name] =
                algorithmState.preview.preview[randomIndex][col.name];
            console.log(
                "Generated value for column (text):",
                col.name,
                generated[col.name]
            );
        } else if (pythonToJsType[col.type] === "boolean") {
            const randomBool = Math.random() < 0.5;
            generated[col.name] = randomBool;
            console.log(
                "Generated value for column (boolean):",
                col.name,
                randomBool
            );
        }
    });

    console.log("Final Generated Input:", generated);
    stateSetter((prevState) => ({ ...prevState, savedInput: generated }));
};

const handleInputChange = (colName, value, colType, pythonToJsType, stateSetter, setError) => {
    try {
        if (colType === "int64") {
            value = parseInt(value);
        }
        if (colType === "float64") {
            value = parseFloat(value);
        }
        if (pythonToJsType[colType] === "test") {
            value = value.toString();
        }
        if (pythonToJsType[colType] === "boolean") {
            value = Boolean(value);
        }
    } catch (error) {
        console.error("Error converting input value:", error);
        setError({
            status: true,
            message: "Error converting input value:",
        });
    }
    stateSetter((prevState) => ({
        ...prevState,
        savedInput: {
            ...prevState.savedInput,
            [colName]: value,
        },
    }));
};

export {
    handleUpload,
    handleFileChange,
    handleTargetSelection,
    generateInput,
    handleInputChange
}