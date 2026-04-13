// snake_case → camelCase
export const toCamel = (str: string): string =>
    str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

// camelCase → snake_case
export const toSnake = (str: string): string =>
    str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

// DB row → API object
export const mapRowToCamel = <T>(row: Record<string, any>): T => {
    const result: Record<string, any> = {};

    for (const key in row) {
        result[toCamel(key)] = row[key];
    }

    return result as T;
};

export const mapRowsToCamel = <T>(rows: Record<string, any>[]): T[] =>
    rows.map((row) => mapRowToCamel<T>(row));

// API object → DB insert/update object
export const mapToSnake = (obj: Record<string, any>) => {
    const result: Record<string, any> = {};

    for (const key in obj) {
        result[toSnake(key)] = obj[key];
    }

    return result;
};
