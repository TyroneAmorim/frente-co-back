import { IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class NewAddressDTO {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;
}
