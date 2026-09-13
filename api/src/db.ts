import sql from "mssql";

let pool: Promise<sql.ConnectionPool> | undefined;

export function database() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (!connectionString) throw new Error("SERVER_NOT_CONFIGURED");
  pool ||= sql.connect(connectionString).catch(error => {
    pool = undefined;
    throw error;
  });
  return pool;
}

export { sql };
