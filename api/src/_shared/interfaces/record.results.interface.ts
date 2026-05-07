export interface RecordResultInterface<RecordEntity> {
  data: RecordEntity[];
  total: number;
  limit?: number;
  offset?: number;
  hasNext?: boolean;
}
