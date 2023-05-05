module.exports = {
  type: process.env.CONNECTION,
  host: process.env.HOST,
  port: process.env.PORT_DB,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: false, 
  logging: false,
  migrationsTableName: 'migrations',
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: 'src/database/migrations',
    subscribersDir: "src/subscriber"
  },
  extra: {
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 60000,
  },
  ssl: true,
};
