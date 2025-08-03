"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueByPath = getValueByPath;
exports.setValueByPath = setValueByPath;
exports.hasPath = hasPath;
exports.deletePath = deletePath;
exports.isValidPath = isValidPath;
exports.getAllPaths = getAllPaths;
exports.clearPathCache = clearPathCache;
const pathCache = new Map();
function parsePath(path) {
    if (pathCache.has(path)) {
        return pathCache.get(path);
    }
    const keys = path.split('.');
    pathCache.set(path, keys);
    return keys;
}
function getValueByPath(obj, path) {
    const keys = parsePath(path);
    let result = obj;
    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return undefined;
        }
        result = result[key];
    }
    return result;
}
function setValueByPath(obj, path, value, options) {
    const keys = parsePath(path);
    const lastKey = keys.pop();
    const target = options?.immutable ? structuredClone(obj) : obj;
    let current = target;
    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
            current[key] = {};
        }
        current = current[key];
    }
    current[lastKey] = value;
    return target;
}
function hasPath(obj, path) {
    const keys = parsePath(path);
    let current = obj;
    for (const key of keys) {
        if (current == null || typeof current !== 'object' || !(key in current)) {
            return false;
        }
        current = current[key];
    }
    return true;
}
function deletePath(obj, path, options) {
    const keys = parsePath(path);
    const lastKey = keys.pop();
    const target = options?.immutable ? structuredClone(obj) : obj;
    let current = target;
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
function isValidPath(obj, path) {
    return typeof path === 'string' && path.length > 0 && hasPath(obj, path);
}
function getAllPaths(obj, prefix = '') {
    const paths = [];
    const stack = [{ obj, prefix }];
    while (stack.length > 0) {
        const { obj: current, prefix: currentPrefix } = stack.pop();
        for (const key in current) {
            if (Object.hasOwn(current, key)) {
                const newPath = currentPrefix ? `${currentPrefix}.${key}` : key;
                paths.push(newPath);
                if (current[key] &&
                    typeof current[key] === 'object' &&
                    !Array.isArray(current[key])) {
                    stack.push({ obj: current[key], prefix: newPath });
                }
            }
        }
    }
    return paths;
}
function clearPathCache() {
    pathCache.clear();
}
//# sourceMappingURL=utils.js.map