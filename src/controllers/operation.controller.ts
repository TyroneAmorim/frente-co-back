import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { NewOperationDTO } from '../dto/newOperation.dto';
import { Operation } from '../entities/operation.entity';
import { CurrentUserData } from '../interfaces/currentUser.interface';
import { OperationService } from '../services/operation.service';

@Controller('operation')
export class OperationController {
  constructor(private operationService: OperationService) {}

  @Post()
  new(
    @Body() operationData: NewOperationDTO,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<void> {
    return this.operationService.new(operationData, currentUser);
  }

  @Get()
  getAll(@CurrentUser() currentUser: CurrentUserData): Promise<Operation[]> {
    return this.operationService.getAll(currentUser);
  }

  @Get('/packages')
  getPackages(@CurrentUser() currentUser: CurrentUserData): Promise<any[]> {
    return this.operationService.getPackages(currentUser);
  }
}
