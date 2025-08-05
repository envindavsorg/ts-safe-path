import type { SchemaValidator, ValidationResult } from './schema';
import type { DeepPartial, PathKeys, PathValue, SafePathOptions, ValidatedSafePathOptions } from './types';
import { clearPathCache, deletePath, getAllPaths, getValueByPath, hasPath, isValidPath, setValueByPath } from './utils';
export interface SafePath<T extends Record<string, unknown>> {
    get<P extends PathKeys<T>>(path: P): PathValue<T, P> | undefined;
    set<P extends PathKeys<T>>(path: P, value: PathValue<T, P>, options?: SafePathOptions): T;
    has<P extends PathKeys<T>>(path: P): boolean;
    delete<P extends PathKeys<T>>(path: P, options?: SafePathOptions): T;
    update<P extends PathKeys<T>>(path: P, updater: (current: PathValue<T, P> | undefined) => PathValue<T, P>, options?: SafePathOptions): T;
    merge(partial: DeepPartial<T>, options?: SafePathOptions): T;
    getAllPaths(): PathKeys<T>[];
    isValidPath(path: string): path is PathKeys<T>;
    validate<P extends PathKeys<T>>(path: P, schema: SchemaValidator<PathValue<T, P>>): ValidationResult<PathValue<T, P>>;
    validateAndSet<P extends PathKeys<T>>(path: P, value: unknown, schema: SchemaValidator<PathValue<T, P>>, options?: ValidatedSafePathOptions): T;
    safeValidate<P extends PathKeys<T>>(path: P, schema: SchemaValidator<PathValue<T, P>>): ValidationResult<PathValue<T, P>>;
}
export declare const safePath: <T extends Record<string, unknown>>(obj: T, defaultOptions?: SafePathOptions) => SafePath<T>;
export type { PathKeys, PathValue, DeepPartial, SafePathOptions, ValidatedSafePathOptions, };
export type { SchemaValidator, ValidationError, ValidationResult, } from './schema';
export { s } from './schema';
export { getValueByPath, setValueByPath, hasPath, deletePath, isValidPath, getAllPaths, clearPathCache, };
//# sourceMappingURL=index.d.ts.map