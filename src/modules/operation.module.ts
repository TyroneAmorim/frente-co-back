import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationController } from 'src/controllers/operation.controller';
import { Operation } from 'src/entities/operation.entity';
import { Package } from 'src/entities/package.entity';
import { OperationService } from 'src/services/operation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Package])],
  controllers: [OperationController],
  providers: [OperationService],
})
export class OperationModule {}
