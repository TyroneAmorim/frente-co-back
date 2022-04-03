export interface NewOperationData {
  clientId: number;
  value: number;
  paperMoneyType: number;
  mainOperation?: number;
  packageId: number;
  reserved?: boolean;
  closed?: boolean;
  closedAt?: string;
}
