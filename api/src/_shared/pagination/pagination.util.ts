import { SelectQueryBuilder } from 'typeorm';
import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT,
  MIN_OFFSET,
} from './pagination.constants';

export interface PaginationInput {
  limit?: number | string;
  offset?: number | string;
}

export interface PaginationConfig {
  defaultLimit?: number;
  maxLimit?: number;
  minLimit?: number;
  minOffset?: number;
}

export interface NormalizedPagination {
  limit: number;
  offset: number;
}

export interface PaginatedResult<Entity> {
  data: Entity[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

const toInteger = (value?: number | string): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.floor(parsed);
};

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

export function normalizePagination(
  input: PaginationInput = {},
  config: PaginationConfig = {},
): NormalizedPagination {
  const {
    defaultLimit = DEFAULT_LIMIT,
    maxLimit = MAX_LIMIT,
    minLimit = MIN_LIMIT,
    minOffset = MIN_OFFSET,
  } = config;

  const rawLimit = toInteger(input.limit);
  const rawOffset = toInteger(input.offset);

  const limit = clamp(
    rawLimit === null ? defaultLimit : rawLimit,
    minLimit,
    maxLimit,
  );

  const offset = Math.max(rawOffset === null ? 0 : rawOffset, minOffset);

  return { limit, offset };
}

export async function applyPagination<Entity>(
  query: SelectQueryBuilder<Entity>,
  pagination: NormalizedPagination,
): Promise<PaginatedResult<Entity>> {
  const { limit, offset } = pagination;
  const [data, total] = await query.skip(offset).take(limit).getManyAndCount();
  const hasNext = offset + data.length < total;

  return { data, total, limit, offset, hasNext };
}
