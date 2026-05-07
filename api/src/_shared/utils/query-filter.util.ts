import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import HelperFunctions from './helper-functions';

export type FilterMatchMode =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'dateIs'
  | 'dateIsNot'
  | 'dateBefore'
  | 'dateAfter';

const TEXT_MATCH_MODES: Set<FilterMatchMode> = new Set([
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
]);

const NUMBER_MATCH_MODES: Set<FilterMatchMode> = new Set([
  'equals',
  'notEquals',
  'lt',
  'lte',
  'gt',
  'gte',
]);

const DATE_MATCH_MODES: Set<FilterMatchMode> = new Set([
  'equals',
  'notEquals',
  'lt',
  'lte',
  'gt',
  'gte',
  'dateIs',
  'dateIsNot',
  'dateBefore',
  'dateAfter',
]);

export function normalizeMatchMode(
  value: unknown,
  fallback: FilterMatchMode,
): FilterMatchMode {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed.length) {
    return fallback;
  }

  return (trimmed as FilterMatchMode) ?? fallback;
}

export function applyStringFilter(
  query: SelectQueryBuilder<any>,
  column: string,
  paramBase: string,
  value: string | string[] | null | undefined,
  matchMode?: string | string[],
  options: {
    defaultMode?: FilterMatchMode;
    accentInsensitive?: boolean;
    operator?: string;
    transform?: (value: any) => string | null | undefined;
  } = {},
): void {
  const rawValues = Array.isArray(value) ? value : [value];
  const rawModes = Array.isArray(matchMode) ? matchMode : [matchMode];

  const normalizedValues = rawValues
    .map((item) => {
      const transformed = options.transform
        ? options.transform(item)
        : item;
      const normalized = HelperFunctions.normalizeForSearch(
        transformed ?? '',
      );
      return normalized.length ? normalized : null;
    })
    .filter((item): item is string => !!item);

  if (!normalizedValues.length) {
    return;
  }

  const accentInsensitive = options.accentInsensitive !== false;

  const buildLike = (suffix: string, pattern: string) => {
    const paramName = `${paramBase}_${suffix}`;
    const condition = accentInsensitive
      ? HelperFunctions.accentInsensitiveLike(column, paramName)
      : `lower(${column}) LIKE lower(:${paramName})`;
    return { condition, params: { [paramName]: pattern } };
  };

  const operator =
    options.operator && options.operator.toString().toLowerCase() === 'or'
      ? 'or'
      : 'and';

  const applyCondition = (
    qb: WhereExpressionBuilder,
    condition: string,
    params: Record<string, any>,
    negate: boolean,
    useOr: boolean,
  ) => {
    const finalCondition = negate ? `NOT (${condition})` : condition;
    if (useOr) {
      qb.orWhere(finalCondition, params);
    } else {
      qb.andWhere(finalCondition, params);
    }
  };

  if (normalizedValues.length === 1 && !Array.isArray(value)) {
    const mode = normalizeMatchMode(
      rawModes[0],
      options.defaultMode ?? 'contains',
    );
    const resolvedMode = TEXT_MATCH_MODES.has(mode) ? mode : 'contains';
    const baseValue = normalizedValues[0];
    let condition: string;
    let params: Record<string, any> = {};
    let negate = false;

    switch (resolvedMode) {
      case 'equals': {
        ({ condition, params } = buildLike('eq', baseValue));
        break;
      }
      case 'notEquals': {
        ({ condition, params } = buildLike('neq', baseValue));
        negate = true;
        break;
      }
      case 'startsWith': {
        ({ condition, params } = buildLike('sw', `${baseValue}%`));
        break;
      }
      case 'endsWith': {
        ({ condition, params } = buildLike('ew', `%${baseValue}`));
        break;
      }
      case 'notContains': {
        ({ condition, params } = buildLike('nct', `%${baseValue}%`));
        negate = true;
        break;
      }
      case 'contains':
      default: {
        ({ condition, params } = buildLike('ct', `%${baseValue}%`));
        break;
      }
    }

    query.andWhere(negate ? `NOT (${condition})` : condition, params);
    return;
  }

  query.andWhere(
    new Brackets((qb) => {
      normalizedValues.forEach((normalized, index) => {
        const mode = normalizeMatchMode(
          rawModes[index] ?? rawModes[0],
          options.defaultMode ?? 'contains',
        );
        const resolvedMode = TEXT_MATCH_MODES.has(mode) ? mode : 'contains';
        const suffix = `${index}_${resolvedMode}`;
        let condition: string;
        let params: Record<string, any> = {};
        let negate = false;

        switch (resolvedMode) {
          case 'equals': {
            ({ condition, params } = buildLike(`eq_${suffix}`, normalized));
            break;
          }
          case 'notEquals': {
            ({ condition, params } = buildLike(`neq_${suffix}`, normalized));
            negate = true;
            break;
          }
          case 'startsWith': {
            ({ condition, params } = buildLike(`sw_${suffix}`, `${normalized}%`));
            break;
          }
          case 'endsWith': {
            ({ condition, params } = buildLike(`ew_${suffix}`, `%${normalized}`));
            break;
          }
          case 'notContains': {
            ({ condition, params } = buildLike(`nct_${suffix}`, `%${normalized}%`));
            negate = true;
            break;
          }
          case 'contains':
          default: {
            ({ condition, params } = buildLike(`ct_${suffix}`, `%${normalized}%`));
            break;
          }
        }

        applyCondition(qb, condition, params, negate, operator === 'or');
      });
    }),
  );
}

export function applyNumberFilter(
  query: SelectQueryBuilder<any>,
  column: string,
  paramBase: string,
  value: unknown,
  matchMode?: string | string[],
  options: {
    defaultMode?: FilterMatchMode;
    operator?: string;
    transform?: (value: any) => number | null | undefined;
  } = {},
): void {
  const rawValues = Array.isArray(value) ? value : [value];
  const rawModes = Array.isArray(matchMode) ? matchMode : [matchMode];
  const normalizedValues = rawValues
    .map((item) => {
      if (options.transform) {
        return options.transform(item);
      }
      if (item === null || item === undefined || item === '') {
        return null;
      }
      const parsed = Number(item);
      return Number.isNaN(parsed) ? null : parsed;
    })
    .filter((item): item is number => item !== null && item !== undefined);

  if (!normalizedValues.length) {
    return;
  }

  const operator =
    options.operator && options.operator.toString().toLowerCase() === 'or'
      ? 'or'
      : 'and';

  const operatorMap: Record<FilterMatchMode, string> = {
    equals: '=',
    notEquals: '<>',
    lt: '<',
    lte: '<=',
    gt: '>',
    gte: '>=',
    contains: '=',
    notContains: '=',
    startsWith: '=',
    endsWith: '=',
    dateIs: '=',
    dateIsNot: '<>',
    dateBefore: '<',
    dateAfter: '>',
  };

  const applyCondition = (
    qb: WhereExpressionBuilder,
    condition: string,
    params: Record<string, any>,
    useOr: boolean,
  ) => {
    if (useOr) {
      qb.orWhere(condition, params);
    } else {
      qb.andWhere(condition, params);
    }
  };

  if (normalizedValues.length === 1 && !Array.isArray(value)) {
    const mode = normalizeMatchMode(matchMode as string, options.defaultMode ?? 'equals');
    const resolvedMode = NUMBER_MATCH_MODES.has(mode) ? mode : 'equals';
    const op = operatorMap[resolvedMode] ?? '=';
    query.andWhere(`${column} ${op} :${paramBase}`, {
      [paramBase]: normalizedValues[0],
    });
    return;
  }

  query.andWhere(
    new Brackets((qb) => {
      normalizedValues.forEach((normalized, index) => {
        const mode = normalizeMatchMode(
          rawModes[index] ?? rawModes[0],
          options.defaultMode ?? 'equals',
        );
        const resolvedMode = NUMBER_MATCH_MODES.has(mode) ? mode : 'equals';
        const op = operatorMap[resolvedMode] ?? '=';
        applyCondition(
          qb,
          `${column} ${op} :${paramBase}_${index}`,
          { [`${paramBase}_${index}`]: normalized },
          operator === 'or',
        );
      });
    }),
  );
}

export function applyDateFilter(
  query: SelectQueryBuilder<any>,
  column: string,
  paramBase: string,
  value: unknown,
  matchMode?: string | string[],
  options: {
    defaultMode?: FilterMatchMode;
    operator?: string;
    transform?: (value: any) => string | null | undefined;
  } = {},
): void {
  const rawValues = Array.isArray(value) ? value : [value];
  const rawModes = Array.isArray(matchMode) ? matchMode : [matchMode];
  const normalizedValues = rawValues
    .map((item) => {
      if (options.transform) {
        return options.transform(item);
      }
      const trimmed = item?.toString().trim();
      return trimmed ? trimmed : null;
    })
    .filter((item): item is string => !!item);

  if (!normalizedValues.length) {
    return;
  }

  const operator =
    options.operator && options.operator.toString().toLowerCase() === 'or'
      ? 'or'
      : 'and';

  const operatorMap: Record<FilterMatchMode, string> = {
    equals: '=',
    notEquals: '<>',
    lt: '<',
    lte: '<=',
    gt: '>',
    gte: '>=',
    dateIs: '=',
    dateIsNot: '<>',
    dateBefore: '<=',
    dateAfter: '>=',
    contains: '=',
    notContains: '=',
    startsWith: '=',
    endsWith: '=',
  };

  const applyCondition = (
    qb: WhereExpressionBuilder,
    condition: string,
    params: Record<string, any>,
    useOr: boolean,
  ) => {
    if (useOr) {
      qb.orWhere(condition, params);
    } else {
      qb.andWhere(condition, params);
    }
  };

  if (normalizedValues.length === 1 && !Array.isArray(value)) {
    const mode = normalizeMatchMode(matchMode as string, options.defaultMode ?? 'dateIs');
    const resolvedMode = DATE_MATCH_MODES.has(mode) ? mode : 'dateIs';
    const op = operatorMap[resolvedMode] ?? '=';
    query.andWhere(`${column} ${op} :${paramBase}`, {
      [paramBase]: normalizedValues[0],
    });
    return;
  }

  query.andWhere(
    new Brackets((qb) => {
      normalizedValues.forEach((normalized, index) => {
        const mode = normalizeMatchMode(
          rawModes[index] ?? rawModes[0],
          options.defaultMode ?? 'dateIs',
        );
        const resolvedMode = DATE_MATCH_MODES.has(mode) ? mode : 'dateIs';
        const op = operatorMap[resolvedMode] ?? '=';
        applyCondition(
          qb,
          `${column} ${op} :${paramBase}_${index}`,
          { [`${paramBase}_${index}`]: normalized },
          operator === 'or',
        );
      });
    }),
  );
}
