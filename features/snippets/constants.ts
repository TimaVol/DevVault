export const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "plaintext", label: "Plaintext" },
] as const;

export function getLanguageOptions(extra?: string) {
  if (extra && !LANGUAGES.some((lang) => lang.value === extra)) {
    return [...LANGUAGES, { value: extra, label: extra }];
  }
  return LANGUAGES;
}
