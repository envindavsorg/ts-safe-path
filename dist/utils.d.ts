import type { PathKeys, PathValue, SafePathOptions } from './types';
export declare const getValueByPath: <T extends Record<string, unknown>, P extends PathKeys<T>>(obj: T, path: P) => PathValue<T, P> | undefined;
export declare const setValueByPath: <T extends Record<string, unknown>, P extends PathKeys<T>>(obj: T, path: P, value: PathValue<T, P>, options?: SafePathOptions) => T;
export declare const hasPath: <T extends Record<string, unknown>, P extends PathKeys<T>>(obj: T, path: P) => boolean;
export declare const deletePath: <T extends Record<string, unknown>, P extends PathKeys<T>>(obj: T, path: P, options?: SafePathOptions) => T;
export declare const isValidPath: <T extends Record<string, unknown>>(obj: T, path: string) => path is PathKeys<T>;
export declare const getAllPaths: <T extends Record<string, unknown>>(obj: T, prefix?: string) => PathKeys<T>[];
export declare const clearPathCache: () => void;
//# sourceMappingURL=utils.d.ts.map