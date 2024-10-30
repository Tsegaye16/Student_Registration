import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files
import enTranslation from "./locales/en.json";
import amTranslation from "./locales/am.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    am: { translation: amTranslation },
  },
  lng: savedLanguage, // Default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
