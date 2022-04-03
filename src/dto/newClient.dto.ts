import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class NewClientDTO {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  birthDate: Date;

  @IsString()
  cpf: string;

  @IsString()
  addressText: string;

  @IsString()
  city: string;

  @IsString()
  @MaxLength(2)
  state: string;

  @IsNumber()
  @IsOptional()
  addressId?: number;
}
