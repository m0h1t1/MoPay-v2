import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  card_name: string;

  @ManyToOne(() => User, user => user.cards, { onDelete: 'CASCADE' })
  user: User;
}
