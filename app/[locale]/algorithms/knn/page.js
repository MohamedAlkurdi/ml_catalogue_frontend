"use client";

import { useEffect, useState } from "react";
import ErrorLogger from "@/components/ErrorLogger";
import { handleFinalResults } from './utils'
import { handleUpload, handleFileChange } from '../common_utils'

import DataUploader from "../../../../components/DataUploader.jsx";
import AlgorithmConfig from "./components/AlgorithmConfig";
import KNNHowItWorks from "./components/KNNHowItWorks";
import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const [knnState, setKnnState] = useState({
    file: null,
    preview: null,
    columns: null,
    selectedTarget: null,
    savedInput: {},
    readyForResults: false,
    results: null,
  });
  const locale = useLocale()
  const translation = useTranslation(locale)
  const review_inputs_error_message = translation.errors.review_inputs
  const get_results_message = translation.knn_page.get_results
  const op_type_message = translation.knn_page.op_type
  const result_message = translation.knn_page.result
  const loading_message = translation.knn_page.loading

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL



  const pythonToJsType = {
    int64: "number",
    float64: "number",
    bool: "boolean",
    object: "text",
    category: "text",
    datetime64: "text",
  };

  useEffect(() => {
    console.log("error:", error);
    if (error.status === false) {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (knnState.preview !== null) {
      console.log(knnState.preview);
      console.log(knnState.preview.columns);
      setKnnState((prevState) => ({
        ...prevState,
        columns: knnState.preview.columns,
      }));
    }
  }, [knnState.preview]);

  useEffect(() => {
    if (
      knnState.file !== null &&
      knnState.selectedTarget !== null &&
      knnState.savedInput !== null
    ) {
      if (
        knnState.file &&
        knnState.selectedTarget &&
        knnState.savedInput
      ) {
        setKnnState((prevState) => ({
          ...prevState,
          readyForResults: true,
        }));
      } else {
        setKnnState((prevState) => ({
          ...prevState,
          readyForResults: false,
        }));
        setError({ status: true, message: review_inputs_error_message });
      }
    }
  }, [knnState.file, knnState.selectedTarget, knnState.savedInput]);

  useEffect(() => {
    if (error.status) {
      const timer = setTimeout(() => {
        setError({ status: false, message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className={`p-6 max-sm:p-2 not-first:min-h-screen text-primary ${locale === 'en' || locale === 'tr' ? `ltr` : 'rtl'}`}>
      <div className="max-w-4xl mx-auto shadow-md rounded-lg p-6 max-sm:p-3 card-bg text-primary mt-16 mb-6">
        <DataUploader
          url={`${BACKEND_URL}/knn/preview-csv/`}
          handleFileChange={handleFileChange}
          stateSetter={setKnnState}
          algorithmState={knnState}
          handleUpload={handleUpload}
          setError={setError}
        />

        {knnState.columns && knnState.preview &&
          <AlgorithmConfig
            knnState={knnState}
            setKnnState={setKnnState}
            pythonToJsType={pythonToJsType}
            setError={setError} />
        }

        {knnState.readyForResults && knnState.preview && (
          <button
            onClick={() => handleFinalResults(knnState, setError, setLoading, setKnnState, translation)}
            className="mt-6 btn btn"
          >
            {get_results_message}
          </button>
        )}
        {knnState.preview && (loading ? (
          <p className="my-4 text-primary">{loading_message}</p>
        ) : knnState.results ? (
          <div className="mt-6 p-4 border rounded bg-primary text-primary">
            <p className="text-lg font-semibold">
              {op_type_message} {knnState.results.operation_type}
            </p>
            <p className="text-lg font-semibold">
              {result_message} {knnState.results.result}
            </p>
          </div>
        ) : null)}
        {error.status && (
          <ErrorLogger
            message={
              typeof error.message === "string"
                ? error.message
                : JSON.stringify(error.message)
            }
          />
        )}
      </div>
      <KNNHowItWorks />
    </div>
  );
}
