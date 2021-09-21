import { ClientConfig } from 'pg';

export const getDBClientOptions: () => ClientConfig = () => {
  const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

  return {
    host: PG_HOST,
    port: parseInt(PG_PORT, 10),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  };
};
