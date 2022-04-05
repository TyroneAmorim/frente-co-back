import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationController } from '../controllers/operation.controller';
import { Operation } from '../entities/operation.entity';
import { Package } from '../entities/package.entity';
import { OperationService } from '../services/operation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Package])],
  controllers: [OperationController],
  providers: [OperationService],
})
export class OperationModule {}
