declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string,
    DB_CNX_STR: string,
    FRONT_END_URL: string,
  }
}
