import { FilterMetadata } from 'primeng/api';

export interface FilterParamOptions {
  opKey?: string;
  defaultMatchMode?: string;
  transform?: (value: any) => any;
}

export function applyFilterParam(
  params: Record<string, any>,
  paramKey: string,
  filter?: FilterMetadata | FilterMetadata[] | null,
  options: FilterParamOptions = {},
): void {
  if (!filter) {
    return;
  }

  const meta = Array.isArray(filter) ? filter[0] : filter;
  if (!meta) {
    return;
  }

  const constraints = (Array.isArray(filter)
    ? filter
    : (meta as any)?.constraints ?? []) as Array<{
    value?: any;
    matchMode?: string;
  }>;

  if (constraints.length) {
    const values: any[] = [];
    const matchModes: string[] = [];

    constraints.forEach((constraint: { value?: any; matchMode?: string }) => {
      const rawValue = constraint?.value;
      const value = options.transform ? options.transform(rawValue) : rawValue;
      if (value === undefined || value === null || value === '') {
        return;
      }

      values.push(value);
      matchModes.push(
        (constraint?.matchMode ?? options.defaultMatchMode ?? '').toString(),
      );
    });

    if (!values.length) {
      return;
    }

    params[paramKey] = values;
    params[options.opKey ?? `${paramKey}_op`] = matchModes;

    const operator =
      (meta as any)?.operator ?? (filter as any)?.operator ?? undefined;
    if (operator) {
      params[`${paramKey}_operator`] = operator;
    }

    return;
  }

  const rawValue = meta.value;
  const value = options.transform ? options.transform(rawValue) : rawValue;
  if (value === undefined || value === null || value === '') {
    return;
  }

  params[paramKey] = value;

  const matchMode = meta.matchMode ?? options.defaultMatchMode;
  if (matchMode) {
    params[options.opKey ?? `${paramKey}_op`] = matchMode;
  }
}
