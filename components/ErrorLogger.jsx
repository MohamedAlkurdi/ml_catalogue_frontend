import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";
import { useState, useEffect } from "react";

export default function ErrorLogger({ message, duration = 3000 }) {
    const [visible, setVisible] = useState(true);
    const locale = useLocale()
    const translation = useTranslation(locale)
    const error_word = translation.errors.error

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed bottom-3 left-1/2 transform -translate-x-1/2 z-50" role="alert">
            {error_word} <strong>{message}</strong>
        </div>
    );
}