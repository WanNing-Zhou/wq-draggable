import {App} from "vue";

/**
 * 向上取整
 * @param {*} num
 * @param {*} min 超过多少取整
 */
export const ceil = (num: number, min: number = 0.2) => (num > 1 && num % 1 > min ? Math.ceil(num) : parseInt(num.toString()));


export const withInstall = (comp: any) => {
    comp.install = (app: App) => {
        // 注册组件
        app.component(comp.name, comp)
    }
    return comp
}