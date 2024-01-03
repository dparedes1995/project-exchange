import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sourceCurrency: string;

  @Column()
  targetCurrency: string;

  @Column('float')
  rate: number;
}
