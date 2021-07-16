import { createConnection } from 'typeorm';
import * as config from 'config';
import { User } from 'src/entities/user.entity';
import { Roles } from 'src/entities/roles.entity';

/*console.log({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});*/
export const databaseProviders = [
  {
    provide: 'DATABASE',
    useFactory: async () => {
      return await createConnection({
        type: config.has('db.type') ? config.get('db.type') : 'mysql',
        host: config.has('db.host') ? config.get('db.host') : process.env.DB_HOST,
        port: config.has('db.port') ? config.get('db.port') : parseInt(process.env.DB_PORT),
        username: config.has('db.username') ? config.get('db.username') : process.env.DB_USERNAME,
        password: config.has('db.password') ? config.get('db.password') : process.env.DB_PASSWORD,
        database: config.has('db.database') ? config.get('db.database') : process.env.DB_NAME,
        charset: "utf8mb4_unicode_ci",
        synchronize: config.has('db.synchronize') ? config.get('db.synchronize') : process.env.SYNC == 'true',
        logging: config.has('db.logging') ? config.get('db.logging') : process.env.LOGGING == 'true',
        entities: [
          User,
          Roles
        ],
      });
    },
  },
];
