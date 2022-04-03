import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { PermissionMiddleware } from './middleware/permission.middleware';
import { ClientModule } from './modules/client.module';
import { LoginModule } from './modules/login.module';
import { OperationModule } from './modules/operation.module';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      schema: process.env.DB_SCHEMA,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ClientModule,
    LoginModule,
    OperationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PermissionMiddleware).forRoutes(
      {
        path: 'client',
        method: RequestMethod.ALL,
      },
      {
        path: 'operation',
        method: RequestMethod.ALL,
      },
    );
  }
}
