// import {ref, Ref, unref} from "vue";
//
// export interface ElementSize {
//     width : number,
//     height : number
// }
//
// const
//
// export function useElementSize  (target: Ref<HTMLElement>, initailSize: ElementSize = {width: 0, height: 0} ) {
//
//     const width = ref(initailSize.width);
//     const height = ref(initailSize.height);
//     const observer = new ResizeObserver(entries => {
//
//     })
//
//     const $elem = unref(target)
//     const rect = $elem.getBoundingClientRect()
//     width.value = rect.width;
//     height.value = rect.height;
//
// }

// import {ResizeObserver, ResizeObserverCallback} from "resize-observer";
class ResizeObserverStore {
    // 存储目标元素和对应的ResizeObserver实例
    observer= new Map<HTMLElement, ResizeObserver[]>();
    // 获取目标元素对应的ResizeObserver实例
    get(target: HTMLElement) {
        return this.observer.get(target) || [];
    }
    // 设置目标元素对应的ResizeObserver实例
    set(target: HTMLElement, observer: ResizeObserver) {
        const observers = this.observer.get(target);
        if (observers) {
            observers.push(observer);
        } else {
            this.observer.set(target, [observer]);
        }
    };
    // 销毁目标元素对应的ResizeObserver实例
    remove(target: HTMLElement) {
        const observers = this.observer.get(target);
        // 销毁事件
        if (observers) {
            observers.forEach(observer => {
                observer.disconnect();
            });
            this.observer.delete(target);
        }
    }
}
// 创建一个ResizeObserverStore实例
const resizeObserverStore = new ResizeObserverStore();

//  使用ResizeObserver监听目标元素的变化
export const useResizeObserver = (target: HTMLElement, callback: ResizeObserverCallback) => {
    const observer = new ResizeObserver(callback);
    observer.observe(target);
    resizeObserverStore.set(target, observer);
    return observer;
}

// 移除ResizeObserver监听
export const removeResizeObserver = (target: HTMLElement) => {
    resizeObserverStore.remove(target);
}

