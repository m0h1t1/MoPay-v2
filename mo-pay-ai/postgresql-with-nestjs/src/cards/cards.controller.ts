import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('add')
  addCard(@Body() body: { userId: number; card_name: string }) {
    return this.cardsService.addCard(body.userId, body.card_name);
  }

  @Get(':userId')
  getCards(@Param('userId') userId: number) {
    return this.cardsService.getCardsForUser(userId);
  }

  @Delete(':cardId')
  removeCard(@Param('cardId') cardId: number) {
    return this.cardsService.removeCard(cardId);
  }
}
