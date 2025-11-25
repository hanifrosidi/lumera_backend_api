import { Pool } from "pg";

const connect = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: process.env.PGMAX,
  idleTimeoutMillis: process.env.PGIDDLE,
  connectionTimeoutMillis: process.env.PGTIMEOUT,
  maxLifetimeSeconds: process.env.PGLIFE,
});

export default connect;
