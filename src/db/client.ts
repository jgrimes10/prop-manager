import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import env from "@/lib/env";

/** Database client for SQLite */
const client = createClient({
	url: env.DB_FILE_NAME,
});

/** Database client for SQLite */
export const db = drizzle(client);
