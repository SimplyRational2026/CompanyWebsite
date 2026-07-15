// Serves the English version at /en. The locale is forced to "en" for this
// path in LocaleProvider. Temporary entry point until .com serves the app
// directly (the old .com -> .de/en/ redirect lands users here).
export { default } from "../page";
