<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import './PreviewLayout.scss'
import { useBoxGrid } from '../../help/drag.ts';
import { DragItem } from '../../help/types.ts';
import {vSize} from "../../help/directives.ts";

const props = withDefaults(
	defineProps<{
		/** 数据源 */
		data: DragItem[];
		/** 列 */
		column?: number;
		/** 行 */
		row?: number;
		/** 间隔 */
		gap?: number;
		/** 容器圆角 */
		borderRadius?: string;
	}>(),
	{
		column: 0,
		row: 0,
		gap: 0,
		borderRadius: '6px',
	}
);

const previewLayoutRef = ref<HTMLElement>();

const { columnCount, rowCount } = useBoxGrid(
	computed(() => props.data),
	props.column,
	props.row
);

const contentSize = reactive({
  width: 0,
  height: 0,
})
// gird 格子
const boxSize = computed(()=> {
  return {
    width: (contentSize.width - props.gap * (columnCount.value - 1)) /columnCount.value,
    height: (contentSize.height - props.gap * (rowCount.value - 1)) / rowCount.value,
  }
});

const getPreviewStyle = ({ x, y, w, h }: DragItem) => {
	return {
    'border-radius': props.borderRadius,
		// grid 下标从 1 开始, 需要 + 1
		'grid-area': `${y + 1} / ${x + 1} / ${y + h + 1}/ ${x + w + 1}`,
	};
};
</script>

<template>
	<div ref="previewLayoutRef" v-size="contentSize" class="preview-layout">
		<div class="preview-layout__container" :style="{
        'grid-template-columns': `repeat(${columnCount}, ${boxSize.width}px)`,
			'grid-template-rows': `repeat(${rowCount}, ${boxSize.height}px)`,
		}">
			<div v-for="(item, i) in data" class="preview-layout__item" :key="`${String(item.id)}${i}`" :style="getPreviewStyle(item)">
				<slot name="default" :data="item"></slot>
			</div>
		</div>
	</div>
</template>
<!--<style lang="scss" scoped>-->
<!--.preview-layout {-->
<!--	height: 100%;-->
<!--	width: 100%;-->
<!--	position: relative;-->
<!--	overflow-y: auto;-->

<!--	&__container {-->
<!--		display: grid;-->
<!--		row-gap: v-bind("gap+'px'");-->
<!--		column-gap: v-bind("gap+'px'");-->
<!--		grid-template-columns: repeat(v-bind('columnCount'), v-bind("boxSize.width+'px'"));-->
<!--		grid-template-rows: repeat(v-bind('rowCount'), v-bind("boxSize.height+'px'"));-->
<!--	}-->

<!--	&__item {-->
<!--		border-radius: v-bind('borderRadius');-->
<!--		overflow: hidden;-->
<!--	}-->
<!--	.preview-layout__item {-->
<!--		background: #646cff;-->
<!--	}-->
<!--}-->
<!--</style>-->
