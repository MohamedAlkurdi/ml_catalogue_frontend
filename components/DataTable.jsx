import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";
import { useEffect, useState } from "react";

export default function DataTable({ data, rowsToDisplay }) {
  const [rows, setRows] = useState([]);
  const [displayedRowsCount, setDisplayedRowsCount] = useState(0);
  const locale = useLocale()
  const translation = useTranslation(locale)
  const no_data_message = translation.data_table.no_data
  const data_preview_title = translation.data_table.data_preview
  const show_all = translation.data_table.show_all
  const rows_displaye_message = translation.data_table.rows_displayed

  if (!data || !data.preview || !data.columns) {
    return <div>{no_data_message}</div>;
  }

  const actualRowsToDisplay = rowsToDisplay && rowsToDisplay > data.preview.length 
    ? data.preview.length 
    : rowsToDisplay || data.preview.length;

  useEffect(() => {
    console.log("data from data table:", data);
    const initialRows = data.preview.slice(0, actualRowsToDisplay);
    setRows(initialRows);
    setDisplayedRowsCount(initialRows.length);
  }, [data, actualRowsToDisplay]);

  const showAllRows = () => {
    setRows(data.preview);
    setDisplayedRowsCount(data.preview.length);
  };

  useEffect(() => {
    console.log("row state changed:", rows);
    console.log("displayedRowsCount:",displayedRowsCount)
    console.log("data.preview.length:",data.preview.length)

  }, [rows, displayedRowsCount, data]);

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="font-bold text-base sm:text-lg">
          {data_preview_title} <code className="text-xs text-black bg-gray-100 px-2 py-1 rounded">{`(${displayedRowsCount} ${rows_displaye_message})`}</code>
        </h2>
        {displayedRowsCount < data.preview.length && (
          <button 
            className="btn text-sm px-4 py-2 w-full sm:w-auto" 
            onClick={showAllRows}
          >
            {show_all}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="min-w-full bg-primary">
          <thead>
            <tr className="bg-gray-50">
              {data.columns.map((column, index) => (
                <th
                  key={index}
                  className="border-b border-gray-200 px-3 sm:px-4 py-3 font-semibold text-left text-sm sm:text-base text-gray-700"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="btn-color hover:bg-opacity-90 transition-colors">
                {data.columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border-b border-white text-left text-white px-3 sm:px-4 py-3 text-sm sm:text-base break-words"
                  >
                    {typeof row[column.name] === "boolean"
                      ? row[column.name].toString()
                      : row[column.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}