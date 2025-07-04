import { Body, Controller, Post } from '@nestjs/common';
import { SuggestCardService } from './suggest-card.service';
import { SuggestCardDto } from './suggest-card.dto';

@Controller('suggest-card')
export class SuggestCardController {
  constructor(private readonly suggestCardService: SuggestCardService) {}

  @Post()
  async suggestCard(@Body() body: SuggestCardDto) {
    await this.suggestCardService.sendSuggestion(body.card);
    return { message: 'Suggestion sent' };
  }
}
