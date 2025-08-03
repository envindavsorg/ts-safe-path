import type { PathKeys, PathValue, SafePathOptions } from './types';

const pathCache = new Map<string, string[]>();

function parsePath(path: string): string[] {
	if (pathCache.has(path)) {
		return pathCache.get(path)!;
	}
	const keys = path.split('.');
	pathCache.set(path, keys);
	return keys;
}

export function getValueByPath<
	T extends Record<string, any>,
	P extends PathKeys<T>,
>(obj: T, path: P): PathValue<T, P> | undefined {
	const keys = parsePath(path as string);
	let result: any = obj;

	for (const key of keys) {
		if (result == null || typeof result !== 'object') {
			return undefined;
		}
		result = result[key];
	}

	return result as PathValue<T, P>;
}

export function setValueByPath<
	T extends Record<string, any>,
	P extends PathKeys<T>,
>(obj: T, path: P, value: PathValue<T, P>, options?: SafePathOptions): T {
	const keys = parsePath(path as string);
	const lastKey = keys.pop()!;
	const target = options?.immutable ? structuredClone(obj) : obj;
	let current: any = target;

	for (const key of keys) {
		if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
			current[key] = {};
		}
		current = current[key];
	}

	current[lastKey] = value;
	return target;
}

export function hasPath<T extends Record<string, any>, P extends PathKeys<T>>(
	obj: T,
	path: P,
): boolean {
	const keys = parsePath(path as string);
	let current: any = obj;

	for (const key of keys) {
		if (current == null || typeof current !== 'object' || !(key in current)) {
			return false;
		}
		current = current[key];
	}

	return true;
}

export function deletePath<
	T extends Record<string, any>,
	P extends PathKeys<T>,
>(obj: T, path: P, options?: SafePathOptions): T {
	const keys = parsePath(path as string);
	const lastKey = keys.pop()!;
	const target = options?.immutable ? structuredClone(obj) : obj;
	let current: any = target;

	for (const key of keys) {
		if (current == null || typeof current !== 'object' || !(key in current)) {
			return target;
		}
		current = current[key];
	}

	if (current && typeof current === 'object') {
		delete current[lastKey];
	}

	return target;
}

export function isValidPath<T extends Record<string, any>>(
	obj: T,
	path: string,
): path is PathKeys<T> {
	return typeof path === 'string' && path.length > 0 && hasPath(obj, path as PathKeys<T>);
}

export function getAllPaths<T extends Record<string, any>>(
	obj: T,
	prefix = '',
): PathKeys<T>[] {
	const paths: string[] = [];
	const stack: Array<{ obj: any; prefix: string }> = [{ obj, prefix }];

	while (stack.length > 0) {
		const { obj: current, prefix: currentPrefix } = stack.pop()!;

		for (const key in current) {
			if (Object.hasOwn(current, key)) {
				const newPath = currentPrefix ? `${currentPrefix}.${key}` : key;
				paths.push(newPath);

				if (
					current[key] &&
					typeof current[key] === 'object' &&
					!Array.isArray(current[key])
				) {
					stack.push({ obj: current[key], prefix: newPath });
				}
			}
		}
	}

	return paths as PathKeys<T>[];
}

export function clearPathCache(): void {
	pathCache.clear();
}