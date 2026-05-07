import { RecordResultInterface } from '../interfaces/record.results.interface';

export class Record<RecordEntity> {
  public data: RecordEntity[];
  public total: number;
  public limit?: number;
  public offset?: number;
  public hasNext?: boolean;

  constructor(recordResults: RecordResultInterface<RecordEntity>) {
    this.data = recordResults.data;
    this.total = recordResults.total;
    this.limit = recordResults.limit;
    this.offset = recordResults.offset;
    this.hasNext = recordResults.hasNext;
  }
}
