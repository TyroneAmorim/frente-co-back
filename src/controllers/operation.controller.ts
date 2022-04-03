import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { NewOperationDTO } from 'src/dto/newOperation.dto';
import { CurrentUserData } from 'src/interfaces/currentUser.interface';
import { OperationService } from 'src/services/operation.service';

@Controller('operation')
export class OperationController {
  constructor(private operationService: OperationService) {}

  @Post()
  new(
    @Body() operationData: NewOperationDTO,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<any> {
    return this.operationService.new(operationData, currentUser);
  }
}
