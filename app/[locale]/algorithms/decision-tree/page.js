'use client'
import { useEffect, useState } from "react";
import DataUploader from "../../../../components/DataUploader";
import { handleFinalResults } from "./utils"
import { handleFileChange, handleUpload } from '../common_utils'
import AlgorithmConfig from "./components/AlgorithmConfig";
import DecisionTreeVisualizer from "./components/DecisionTreeVisualizer";
import DecisionTreeHowItWorks from "./components/DecisionTreeHowItWorks";
import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });
  const [DTState, setDTState] = useState({
    file: null,
    preview: null,
    columns: null,
    selectedTarget: null,
    readyForResults: false,
    results: null,
  });
  const locale = useLocale()
  const translation = useTranslation(locale)
  const get_results = translation.dt_page.get_results
  const loading_word = translation.dt_page.loading
  const view_json = translation.dt_page.view_json

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL



  console.log("backend url:", BACKEND_URL)


  useEffect(() => {
    if (error.status) {
      const timer = setTimeout(() => {
        setError({ status: false, message: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (DTState.preview !== null) {
      console.log(DTState.preview);
      console.log(DTState.preview.columns);
      setDTState((prevState) => ({
        ...prevState,
        columns: DTState.preview.columns,
      }));
    }
  }, [DTState.preview]);

  useEffect(() => {
    if (DTState.file && DTState.selectedTarget) {
      setDTState((prevState) => ({
        ...prevState,
        readyForResults: true,
      }));
    } else {
      setDTState((prevState) => ({
        ...prevState,
        readyForResults: false,
      }));
    }
  }, [DTState.file, DTState.selectedTarget]);

  return (
    <div className="p-6 max-sm:p-2 not-first:min-h-screen text-primary">
      <div className="max-w-4xl mx-auto shadow-md rounded-lg p-6 max-sm:p-3 card-bg text-primary mt-16 mb-6">
        <DataUploader
          url={`${BACKEND_URL}/dt/data_preview/`}
          handleFileChange={handleFileChange}
          stateSetter={setDTState}
          algorithmState={DTState}
          handleUpload={handleUpload}
          setError={setError}
        />

        {DTState.columns && DTState.preview &&
          <AlgorithmConfig
            DTState={DTState}
            setDTState={setDTState}
            setError={setError}
          />
        }
        {DTState.readyForResults && DTState.preview && (
          <button
            onClick={() => handleFinalResults(DTState, setError, setLoading, setDTState, translation)}
            className="mt-6 btn btn"
          >
            {get_results}
          </button>
        )}
        {DTState.preview && (loading ? (
          <p className="mt-4 text-primary">{loading_word}</p>
        ) : DTState.results ? (
          <>
            <div className="my-6">
              <details className="border border-gray-200 rounded-lg">
                <summary className="px-4 py-2 bg-gray-50 cursor-pointer font-medium text-gray-700">
                  {view_json}
                </summary>
                <pre className="p-4 bg-gray-50 text-sm overflow-x-auto text-gray-600">
                  {JSON.stringify(DTState.results, null, 2)}
                </pre>
              </details>
            </div>
            <DecisionTreeVisualizer tree={DTState.results.decision_tree} />
          </>
        ) : null)}
      </div>
      <DecisionTreeHowItWorks />
    </div>
  );
}
