import i18n from "i18next";
import ko from "./ko.json";
import en from "./en.json";

i18n.init({
  resources: { ko: { translation: ko }, en: { translation: en } },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
