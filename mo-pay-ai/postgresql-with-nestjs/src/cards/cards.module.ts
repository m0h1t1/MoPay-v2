import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './cards.entity';
import { User } from '../users/users.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
