/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // Add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
