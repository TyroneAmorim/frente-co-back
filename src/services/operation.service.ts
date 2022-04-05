import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewOperationDTO } from '../dto/newOperation.dto';
import { Operation } from '../entities/operation.entity';
import { Package } from '../entities/package.entity';
import { CurrentUserData } from '../interfaces/currentUser.interface';
import { OperationSaved } from '../interfaces/operationSaved.interface';
import { IsNull, Not, Repository, UpdateResult } from 'typeorm';

export class OperationService {
  constructor(
    @InjectRepository(Operation) private operation: Repository<Operation>,
    @InjectRepository(Package) private packageEntity: Repository<Package>,
  ) {}

  private currentMainOperation: number;
  private currentPackageId: number;
  private limitMoneyPaperCurrentPackage: number;
  private totalMoneyPaperCurrentPackage: number;
  private totalMoneyPaperOperation: number;
  private totalMoneyPaperToSave: number;
  private operationsSaved: OperationSaved[] = [];
  private limitMoneyPaperPackage: number = parseInt(
    process.env.LIMIT_MONEY_PAPER_PACKAGE,
  );

  private async saveOperation(
    paperMoneyType: number,
    userId: number,
  ): Promise<Operation> {
    const value = this.totalMoneyPaperToSave * paperMoneyType;

    return this.operation.save({
      clientId: userId,
      value,
      packageId: this.currentPackageId,
      paperMoneyType: paperMoneyType,
      closed: false,
      reserved: true,
      openedAt: 'NOW()',
    });
  }

  private async closeOperations(): Promise<UpdateResult> {
    const packages: Package[] = await this.packageEntity.find({
      where: {
        closedAt: Not(IsNull()),
      },
    });
    const packagesIds = packages.map((packageObject) => packageObject.id);

    if (packagesIds.length === 0) return;

    return this.operation
      .createQueryBuilder()
      .update(Operation)
      .set({
        closed: true,
        closedAt: 'NOW()',
        reserved: false,
      })
      .where('package_id IN(:...ids) AND closed = false', { ids: packagesIds })
      .execute();
  }

  private async closePackages(): Promise<UpdateResult> {
    return this.packageEntity
      .createQueryBuilder()
      .update(Package)
      .set({ closedAt: 'NOW()' })
      .where('paper_money_total = :total', {
        total: this.limitMoneyPaperPackage,
      })
      .execute();
  }

  private async savePackage(): Promise<Package> {
    return this.packageEntity.save({
      id: this.currentPackageId,
      paperMoneyTotal:
        this.totalMoneyPaperCurrentPackage + this.totalMoneyPaperToSave,
    });
  }

  private async getPackage(paperMoneyType: number): Promise<void> {
    let packageFree = await this.packageEntity
      .createQueryBuilder('package')
      .where(
        'paper_money_total < :limitMoneyPaperPackage AND paper_money_type = :paperMoneyType',
        {
          limitMoneyPaperPackage: this.limitMoneyPaperPackage,
          paperMoneyType,
        },
      )
      .getOne();

    if (packageFree === null) {
      packageFree = await this.packageEntity.save({
        paperMoneyType,
        paperMoneyTotal: 0,
      });
    }

    this.currentPackageId = packageFree.id;
    this.limitMoneyPaperCurrentPackage =
      this.limitMoneyPaperPackage - packageFree.paperMoneyTotal;

    this.totalMoneyPaperCurrentPackage = packageFree.paperMoneyTotal;
  }

  private calculateMoneyPaperOperation(): Promise<void> {
    return new Promise((resolve) => {
      const actualTotalMoneyPaper = this.totalMoneyPaperOperation;
      this.totalMoneyPaperOperation =
        this.totalMoneyPaperOperation >= this.limitMoneyPaperCurrentPackage
          ? this.totalMoneyPaperOperation - this.limitMoneyPaperCurrentPackage
          : this.totalMoneyPaperOperation - this.totalMoneyPaperOperation;

      this.totalMoneyPaperToSave =
        actualTotalMoneyPaper - this.totalMoneyPaperOperation;
      resolve();
    });
  }

  private async combineOperations(): Promise<void> {
    if (this.operationsSaved.length < 2) return;

    const operationsId = this.operationsSaved.sort((a, b) => b.value - a.value);
    const mainOperation = operationsId[0].id;
    operationsId.shift();

    await this.operation
      .createQueryBuilder()
      .update(Operation)
      .set({ mainOperation })
      .where('id IN (:...ids)', {
        ids: operationsId.map((operation) => operation.id),
      })
      .execute();

    this.operationsSaved = [];
  }

  async new(
    operationData: NewOperationDTO,
    currentUser: CurrentUserData,
  ): Promise<void> {
    this.totalMoneyPaperOperation =
      operationData.value / operationData.paperMoneyType;

    while (this.totalMoneyPaperOperation > 0) {
      await this.getPackage(operationData.paperMoneyType);

      await this.calculateMoneyPaperOperation();

      const currentOperation = await this.saveOperation(
        operationData.paperMoneyType,
        currentUser.id,
      );

      this.operationsSaved.push({
        id: currentOperation.id,
        value: currentOperation.value,
      });

      this.currentMainOperation = !this.currentMainOperation
        ? currentOperation.id
        : this.currentMainOperation;

      await this.savePackage();
    }

    this.combineOperations().then(() =>
      this.closePackages().then(() => this.closeOperations()),
    );
  }

  async getAll(currentUser: CurrentUserData): Promise<Operation[]> {
    return this.operation.find({
      where: {
        clientId: currentUser.id,
      },
    });
  }

  async getPackages(currentUser: CurrentUserData): Promise<any[]> {
    if (!currentUser) throw new UnauthorizedException();

    return this.packageEntity
      .createQueryBuilder('pck')
      .distinct(true)
      .innerJoin('operation', 'op', 'pck.id = op.package_id')
      .where('op.client_id = :id', {
        id: currentUser.id,
      })
      .getRawMany();
  }
}
