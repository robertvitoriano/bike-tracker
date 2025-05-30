import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_MAPBOX_TOKEN: z.string(),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === "true"),
});

export const env = envSchema.parse(import.meta.env);
