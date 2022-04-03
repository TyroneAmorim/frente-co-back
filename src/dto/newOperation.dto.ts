import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class NewOperationDTO {
  @IsNumber()
  @Type(() => Number)
  value: number;

  @IsNumber()
  @Type(() => Number)
  paperMoneyType: number;
}
