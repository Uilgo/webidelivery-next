/**
 * 📌 Configuração do lint-staged para Next.js + Biome
 *
 * Executa linting e formatação apenas nos arquivos staged (git add)
 * antes do commit, garantindo qualidade de código consistente.
 */

module.exports = {
  // Arquivos TypeScript e JavaScript (incluindo JSX/TSX)
  "*.{js,jsx,ts,tsx}": [
    "biome check --write --no-errors-on-unmatched --files-ignore-unknown=true",
  ],

  // Arquivos JSON
  "*.json": ["biome format --write --no-errors-on-unmatched"],

  // Arquivos CSS (se houver CSS nativo além do Tailwind)
  "*.css": ["biome format --write --no-errors-on-unmatched"],

  // Arquivos Markdown
  "*.md": ["biome format --write --no-errors-on-unmatched"],
};
