import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './src/user/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export default function (): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
    entities: [User],
    migrations: ['src/migrations/*.ts'],
    logging: false,
  };
}
