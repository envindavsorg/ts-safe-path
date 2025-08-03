import type { PathKeys, PathValue, SafePathOptions } from './types';

const pathCache = new Map<string, string[]>();

const parsePath = (path: string): string[] => {
	if (pathCache.has(path)) {
		const cached = pathCache.get(path);
		if (cached) {
			return cached;
		}
	}
	const keys = path.split('.');
	pathCache.set(path, keys);
	return keys;
};

export const getValueByPath = <
	T extends Record<string, unknown>,
	P extends PathKeys<T>,
>(
	obj: T,
	path: P,
): PathValue<T, P> | undefined => {
	const keys = parsePath(path as string);
	let result: unknown = obj;

	for (const key of keys) {
		if (result == null || typeof result !== 'object') {
			return undefined;
		}
		result = (result as Record<string, unknown>)[key];
	}

	return result as PathValue<T, P>;
};

export const setValueByPath = <
	T extends Record<string, unknown>,
	P extends PathKeys<T>,
>(
	obj: T,
	path: P,
	value: PathValue<T, P>,
	options?: SafePathOptions,
): T => {
	const keys = parsePath(path as string);
	const lastKey = keys.pop();
	if (!lastKey) {
		return obj;
	}
	const target = options?.immutable ? structuredClone(obj) : obj;
	let current: Record<string, unknown> = target;

	for (const key of keys) {
		if (
			!(key in current) ||
			typeof current[key] !== 'object' ||
			current[key] === null
		) {
			current[key] = {};
		}
		current = current[key] as Record<string, unknown>;
	}

	current[lastKey] = value;
	return target;
};

export const hasPath = <
	T extends Record<string, unknown>,
	P extends PathKeys<T>,
>(
	obj: T,
	path: P,
): boolean => {
	const keys = parsePath(path as string);
	let current = obj;

	for (const key of keys) {
		if (current == null || typeof current !== 'object' || !(key in current)) {
			return false;
		}
		current = (current as Record<string, unknown>)[key] as T;
	}

	return true;
};

export const deletePath = <
	T extends Record<string, unknown>,
	P extends PathKeys<T>,
>(
	obj: T,
	path: P,
	options?: SafePathOptions,
): T => {
	const keys = parsePath(path as string);
	const lastKey = keys.pop();
	if (!lastKey) {
		return obj;
	}
	const target = options?.immutable ? structuredClone(obj) : obj;
	let current: unknown = target;

	for (const key of keys) {
		if (current == null || typeof current !== 'object' || !(key in current)) {
			return target;
		}
		current = (current as Record<string, unknown>)[key];
	}

	if (current && typeof current === 'object') {
		delete (current as Record<string, unknown>)[lastKey];
	}

	return target;
};

export const isValidPath = <T extends Record<string, unknown>>(
	obj: T,
	path: string,
): path is PathKeys<T> =>
	typeof path === 'string' &&
	path.length > 0 &&
	hasPath(obj, path as PathKeys<T>);

export const getAllPaths = <T extends Record<string, unknown>>(
	obj: T,
	prefix = '',
): PathKeys<T>[] => {
	const paths: string[] = [];
	const stack: Array<{ obj: unknown; prefix: string }> = [{ obj, prefix }];

	while (stack.length > 0) {
		const stackItem = stack.pop();
		if (!stackItem) {
			break;
		}
		const { obj: current, prefix: currentPrefix } = stackItem;

		if (current && typeof current === 'object') {
			const currentObj = current as Record<string, unknown>;
			for (const key in currentObj) {
				if (Object.hasOwn(currentObj, key)) {
					const newPath = currentPrefix ? `${currentPrefix}.${key}` : key;
					paths.push(newPath);

					if (
						currentObj[key] &&
						typeof currentObj[key] === 'object' &&
						!Array.isArray(currentObj[key])
					) {
						stack.push({ obj: currentObj[key], prefix: newPath });
					}
				}
			}
		}
	}

	return paths as PathKeys<T>[];
};

export const clearPathCache = (): void => {
	pathCache.clear();
};
