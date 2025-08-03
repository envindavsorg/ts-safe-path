import type {
	DeepPartial,
	PathKeys,
	PathValue,
	SafePathOptions,
} from './types';
import {
	clearPathCache,
	deletePath,
	getAllPaths,
	getValueByPath,
	hasPath,
	isValidPath,
	setValueByPath,
} from './utils';

export interface SafePath<T extends Record<string, unknown>> {
	get<P extends PathKeys<T>>(path: P): PathValue<T, P> | undefined;
	set<P extends PathKeys<T>>(
		path: P,
		value: PathValue<T, P>,
		options?: SafePathOptions,
	): T;
	has<P extends PathKeys<T>>(path: P): boolean;
	delete<P extends PathKeys<T>>(path: P, options?: SafePathOptions): T;
	update<P extends PathKeys<T>>(
		path: P,
		updater: (current: PathValue<T, P> | undefined) => PathValue<T, P>,
		options?: SafePathOptions,
	): T;
	merge(partial: DeepPartial<T>, options?: SafePathOptions): T;
	getAllPaths(): PathKeys<T>[];
	isValidPath(path: string): path is PathKeys<T>;
}

export const safePath = <T extends Record<string, unknown>>(
	obj: T,
	defaultOptions?: SafePathOptions,
): SafePath<T> => ({
	get<P extends PathKeys<T>>(path: P): PathValue<T, P> | undefined {
		return getValueByPath(obj, path);
	},

	set<P extends PathKeys<T>>(
		path: P,
		value: PathValue<T, P>,
		options?: SafePathOptions,
	): T {
		const opts = { ...defaultOptions, ...options };
		if (opts?.immutable) {
			return setValueByPath(obj, path, value, opts);
		}
		setValueByPath(obj, path, value, opts);
		return obj;
	},

	has<P extends PathKeys<T>>(path: P): boolean {
		return hasPath(obj, path);
	},

	delete<P extends PathKeys<T>>(path: P, options?: SafePathOptions): T {
		const opts = { ...defaultOptions, ...options };
		if (opts?.immutable) {
			return deletePath(obj, path, opts);
		}
		deletePath(obj, path, opts);
		return obj;
	},

	update<P extends PathKeys<T>>(
		path: P,
		updater: (current: PathValue<T, P> | undefined) => PathValue<T, P>,
		options?: SafePathOptions,
	): T {
		const currentValue = getValueByPath(obj, path);
		const newValue = updater(currentValue);
		return this.set(path, newValue, options);
	},

	merge(partial: DeepPartial<T>, options?: SafePathOptions): T {
		const opts = { ...defaultOptions, ...options };
		const result = deepMerge(obj, partial, opts?.immutable);
		if (!opts?.immutable) {
			Object.assign(obj, result);
		}
		return result;
	},

	getAllPaths(): PathKeys<T>[] {
		return getAllPaths(obj);
	},

	isValidPath(path: string): path is PathKeys<T> {
		return isValidPath(obj, path);
	},
});

const deepMerge = <T extends Record<string, unknown>>(
	target: T,
	source: DeepPartial<T>,
	immutable = false,
): T => {
	const result = immutable ? structuredClone(target) : { ...target };

	for (const key in source) {
		if (Object.hasOwn(source, key)) {
			const sourceValue = source[key];
			const targetValue = result[key];

			if (
				sourceValue &&
				typeof sourceValue === 'object' &&
				!Array.isArray(sourceValue) &&
				targetValue &&
				typeof targetValue === 'object' &&
				!Array.isArray(targetValue)
			) {
				// @ts-ignore
				result[key] = deepMerge(
					targetValue as Record<string, unknown>,
					sourceValue as DeepPartial<T>,
					immutable,
				);
			} else if (sourceValue !== undefined) {
				// @ts-ignore
				result[key] = sourceValue;
			}
		}
	}

	return result;
};

export type { PathKeys, PathValue, DeepPartial, SafePathOptions };

export {
	getValueByPath,
	setValueByPath,
	hasPath,
	deletePath,
	isValidPath,
	getAllPaths,
	clearPathCache,
};
