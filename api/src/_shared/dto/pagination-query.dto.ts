import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MAX_LIMIT, MIN_OFFSET, MIN_LIMIT } from '../pagination/pagination.constants';

const toNumber = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export class PaginationQueryDto {
  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(MIN_LIMIT)
  @Max(MAX_LIMIT)
  limit?: number;

  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(MIN_OFFSET)
  offset?: number;
}
