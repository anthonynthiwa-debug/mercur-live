import { createClient } from "@mercurjs/client";

export const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
});
