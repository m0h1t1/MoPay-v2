import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { SuggestCardModule } from './suggest-card/suggest-card.module';
import { CardAgentModule } from './agents/CardAgent.module';
import { CardsModule } from './cards/cards.module';
import { Card } from './cards/cards.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Card],
      synchronize: true, // ❗ Only use in dev
    }),
    UsersModule,
    AuthModule,
    SuggestCardModule,
    CardAgentModule,
    CardsModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
