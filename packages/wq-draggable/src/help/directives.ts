import {App, Directive} from "vue";
import {removeResizeObserver, useResizeObserver} from "./hooks";


export const  vSize: Directive = {
    mounted: (el, binding) => {
        //  注册并使用resizeObserver
        useResizeObserver(el, (entries) => {
            binding.value.width = entries[0].contentRect.width
            binding.value.height = entries[0].contentRect.height
        })
    },
    beforeUnmount: (el) => {
        // 销毁resizeObserver
        removeResizeObserver(el)
    },
}

export default (app: App)=>{
    app.directive('size', vSize)
}