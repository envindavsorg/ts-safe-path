import type { DeepPartial, PathKeys, PathValue, SafePathOptions } from './types';
import { deletePath, getValueByPath, hasPath, setValueByPath, isValidPath, getAllPaths, clearPathCache } from './utils';
export interface SafePath<T extends Record<string, any>> {
    get<P extends PathKeys<T>>(path: P): PathValue<T, P> | undefined;
    set<P extends PathKeys<T>>(path: P, value: PathValue<T, P>, options?: SafePathOptions): T;
    has<P extends PathKeys<T>>(path: P): boolean;
    delete<P extends PathKeys<T>>(path: P, options?: SafePathOptions): T;
    update<P extends PathKeys<T>>(path: P, updater: (current: PathValue<T, P> | undefined) => PathValue<T, P>, options?: SafePathOptions): T;
    merge(partial: DeepPartial<T>, options?: SafePathOptions): T;
    getAllPaths(): PathKeys<T>[];
    isValidPath(path: string): path is PathKeys<T>;
}
export declare function safePath<T extends Record<string, any>>(obj: T, defaultOptions?: SafePathOptions): SafePath<T>;
export type { PathKeys, PathValue, DeepPartial, SafePathOptions };
export { getValueByPath, setValueByPath, hasPath, deletePath, isValidPath, getAllPaths, clearPathCache };
//# sourceMappingURL=index.d.ts.map