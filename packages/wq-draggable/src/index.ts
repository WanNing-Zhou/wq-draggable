import {App} from "vue";
import PreviewItem  from "./components/PreviewItem/PreviewItem.vue";
import PreviewLayout from "./components/PreviewLayout/PreviewLayout.vue";
import GridDropContent from "./components/DropContent/DropContent.vue";
import MoveMask  from "./components/MoveMask/MoveMask.vue";
import Drag from "./components/DragItem/DragItem.vue";


const components = [
    PreviewItem,
    PreviewLayout,
    GridDropContent,
    Drag,
    MoveMask
]

export {
    PreviewItem,
    PreviewLayout,
    GridDropContent,
    Drag,
    MoveMask
}

export const install = function (Vue: App) {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}