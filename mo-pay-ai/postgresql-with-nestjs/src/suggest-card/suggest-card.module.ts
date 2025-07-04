import { Module } from '@nestjs/common';
import { SuggestCardController } from './suggest-card.controller';
import { SuggestCardService } from './suggest-card.service';

@Module({
  controllers: [SuggestCardController],
  providers: [SuggestCardService],
})
export class SuggestCardModule {}
