import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column()
  value: number;

  @Column({ name: 'paper_money_type' })
  paperMoneyType: number;

  @Column({ name: 'main_operation' })
  mainOperation?: number;

  @Column({ name: 'package_id' })
  packageId?: number;

  @Column()
  reserved?: boolean;

  @Column()
  closed?: boolean;

  @Column({ name: 'opened_at' })
  openedAt?: string;

  @Column({ name: 'closed_at' })
  closedAt?: string;
}
