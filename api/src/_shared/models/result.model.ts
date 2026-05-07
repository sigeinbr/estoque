export enum Type {
  Success = 'success',
  Warning = 'warn',
  Info = 'info',
  Error = 'error',
}

export class Result {
  type: Type;
  message: string;
  entity: any;

  constructor(type: Type, message: string, entity?: any) {
    this.type = type;
    this.message = message;
    this.entity = entity;
  }
}
