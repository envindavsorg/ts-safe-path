import type { PathKeys, PathValue, SafePathOptions } from './types';
export declare function getValueByPath<T extends Record<string, any>, P extends PathKeys<T>>(obj: T, path: P): PathValue<T, P> | undefined;
export declare function setValueByPath<T extends Record<string, any>, P extends PathKeys<T>>(obj: T, path: P, value: PathValue<T, P>, options?: SafePathOptions): T;
export declare function hasPath<T extends Record<string, any>, P extends PathKeys<T>>(obj: T, path: P): boolean;
export declare function deletePath<T extends Record<string, any>, P extends PathKeys<T>>(obj: T, path: P, options?: SafePathOptions): T;
export declare function isValidPath<T extends Record<string, any>>(obj: T, path: string): path is PathKeys<T>;
export declare function getAllPaths<T extends Record<string, any>>(obj: T, prefix?: string): PathKeys<T>[];
export declare function clearPathCache(): void;
//# sourceMappingURL=utils.d.ts.map