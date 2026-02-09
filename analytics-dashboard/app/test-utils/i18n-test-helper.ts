import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "~/locales/en/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
  },
  lng: "en",
  defaultNS: "common",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
