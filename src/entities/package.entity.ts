import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'paper_money_type' })
  paperMoneyType: number;

  @Column({ name: 'paper_money_total' })
  paperMoneyTotal: number;

  @Column({ name: 'opened_at' })
  openedAt?: string;

  @Column({ name: 'closed_at' })
  closedAt?: string;
}
