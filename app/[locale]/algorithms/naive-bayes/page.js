'use client'
import { useEffect, useState } from "react";
import DataUploader from "../../../../components/DataUploader.jsx";
import { handleFinalResults } from './utils'
import { handleFileChange, handleUpload } from '../common_utils'
import AlgorithmConfig from "./components/AlgorithmConfig";
import NaiveBayesHowItWorks from "./components/NaiveBayesHowItWorks.jsx";
import ErrorLogger from "@/components/ErrorLogger.jsx";
import NaiveBayesVisualizer from "./components/NaiveBayesVisualizer.jsx";
import { useLocale } from "@/app/lib/i18n_context.js";
import useTranslation from "@/app/lib/useTranslation.js";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const [BayesState, setBayesState] = useState({
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
  const get_results = translation.naive_bayes_page.get_results
  const loading_placeholder = translation.naive_bayes_page.loading
  const classification_results = translation.naive_bayes_page.classification_results
  const probs = translation.naive_bayes_page.probs

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
    if (error.status) {
      const timer = setTimeout(() => {
        setError({ status: false, message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (BayesState.preview !== null) {
      console.log(BayesState.preview);
      console.log(BayesState.preview.columns);
      setBayesState((prevState) => ({
        ...prevState,
        columns: BayesState.preview.columns,
      }));
    }
  }, [BayesState.preview]);

  useEffect(() => {
    if (
      BayesState.file &&
      BayesState.selectedTarget &&
      BayesState.savedInput
    ) {
      setBayesState((prevState) => ({
        ...prevState,
        readyForResults: true,
      }));
    } else {
      setBayesState((prevState) => ({
        ...prevState,
        readyForResults: false,
      }));
    }
  }, [BayesState.file, BayesState.selectedTarget, BayesState.savedInput]);

  return (
    <div className="p-6 max-sm:p-2 not-first:min-h-screen text-primary">
      <div className="max-w-4xl mx-auto shadow-md rounded-lg p-6 max-sm:p-3 card-bg text-primary mt-16 mb-6">
        <DataUploader
          url={`${BACKEND_URL}/bayes/preview-csv/`}
          handleFileChange={handleFileChange}
          stateSetter={setBayesState}
          algorithmState={BayesState}
          handleUpload={handleUpload}
          setError={setError}
        />


        {BayesState.columns && BayesState.preview &&
          <AlgorithmConfig
            BayesState={BayesState}
            setBayesState={setBayesState}
            pythonToJsType={pythonToJsType}
            setError={setError} />
        }
        {BayesState.readyForResults && BayesState.preview && (
          <button
            onClick={() => handleFinalResults(BayesState, setError, setLoading, setBayesState, translation)}
            className="mt-6 btn btn"
          >
            {get_results}
          </button>
        )}
        {BayesState.preview && (loading ? (
          <p className="mt-4 text-primary">{loading_placeholder}</p>
        ) : BayesState.results ? (
          <div className="mt-6 p-4 border rounded bg-primary text-primary overflow-x-auto">
            <p className="text-lg font-semibold">
              {classification_results} {BayesState.results.result.classification}
            </p>
            <p className="text-lg font-semibold">
              {probs} {JSON.stringify(BayesState.results.result.probs)}
            </p>
          </div>
        ) : null)}
        {BayesState.results && BayesState.preview && (
          <div className="w-full">
            <NaiveBayesVisualizer result={BayesState.results.result} />
          </div>
        )}
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
      <NaiveBayesHowItWorks />
    </div>
  );
}
