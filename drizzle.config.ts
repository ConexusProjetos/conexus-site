import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { withSslMode } from "./src/server/db/options";

// Carrega variáveis de ambiente: .env.local tem prioridade sobre .env
// (config NÃO sobrescreve variáveis já definidas, então a 1ª chamada vence)
config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida. Crie um arquivo .env.local com base no .env.example."
  );
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Garante SSL para Supabase/Neon/Railway (local permanece sem SSL).
    url: withSslMode(process.env.DATABASE_URL),
  },
  verbose: true,
  strict: true,
});
