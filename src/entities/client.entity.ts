import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  cpf: string;

  @Column({ name: 'address_id' })
  @IsOptional()
  addressId?: number;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address?: Address;
}
