/* eslint-disable import/no-anonymous-default-export */
export const options = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
  // dialectOptions: {
  //   ssl: {
  //     rejectUnauthorized: process.env.NODE_ENV === 'production',
  //   },
  // },
  // logging: process.env.NODE_ENV === 'development' ? console.log : false,
  logging: console.log,
  migrationStorageTableName: 'migrations',
}

export default {
  development: options,
  test: options,
  production: options,
}
