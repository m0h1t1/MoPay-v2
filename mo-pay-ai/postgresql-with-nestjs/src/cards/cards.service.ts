import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './cards.entity';
import { User } from '../users/users.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepo: Repository<Card>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async addCard(userId: number, card_name: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const card = this.cardsRepo.create({ card_name, user });
    return this.cardsRepo.save(card);
  }

  async getCardsForUser(userId: number) {
    return this.cardsRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async removeCard(cardId: number) {
    return this.cardsRepo.delete(cardId);
  }
}
