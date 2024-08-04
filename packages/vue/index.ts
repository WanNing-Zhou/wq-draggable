import PreviewItem  from "./src/PreviewItem.vue";
import PreviewLayout from "./src/PreviewLayout.vue";
import GridDropContent from "./src/GridDropContent.vue";

export {
    PreviewItem,
    PreviewLayout,
    GridDropContent
}

const install = function (Vue) {
    Vue.component(PreviewItem.name, PreviewItem);
    Vue.component(PreviewLayout.name, PreviewLayout);
    Vue.component(GridDropContent.name, GridDropContent);
}