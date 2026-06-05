import alexPlugin from "@alextheman/eslint-plugin";

export default [...alexPlugin.configs["internal/package-json"], {rules: {
    "package-json/require-exports": "off",
    "package-json/require-files": "off"
}}]
