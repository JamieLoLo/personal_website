/* eslint-disable import/no-anonymous-default-export */
export const options = {
  username: process.env.RDS_USERNAME,
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
  migrationStorageTableName: 'migrations',
}

export default {
  development: options,
  test: options,
  production: options,
}
