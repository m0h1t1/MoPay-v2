import { Module } from '@nestjs/common';
import { CardAgentController } from './CardAgent.controller';

@Module({
  controllers: [CardAgentController],
})
export class CardAgentModule {}