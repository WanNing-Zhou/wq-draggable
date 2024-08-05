import {App} from "vue";

/**
 * 向上取整
 * @param {*} num
 * @param {*} min 超过多少取整
 */
export const ceil = (num: number, min: number = 0.2) => (num > 1 && num % 1 > min ? Math.ceil(num) : parseInt(num.toString()));

/**
 * 安装
 * @param comp
 */
export const withInstall = (comp: any) => {
    comp.install = (app: App) => {
        // 注册组件
        app.component(comp.name, comp)
    }
    return comp
}

/**
 * 递归克隆对象
 * @param obj - 要克隆的对象
 * @param cache - 存储循环引用对象的缓存
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T, cache = new WeakMap()): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof RegExp) return new RegExp(obj.source) as unknown as T;
    // 如果出现循环引用，则返回缓存的对象
    if (cache.has(obj)) return cache.get(obj);
    const newObj: T = Array.isArray(obj) ? [] : Object.create(null);
    // 缓存对象，用于循环引用的情况
    cache.set(obj, newObj);
    for (const key in obj) {
        newObj[key] = deepClone(obj[key], cache);
    }
    return newObj;
};
