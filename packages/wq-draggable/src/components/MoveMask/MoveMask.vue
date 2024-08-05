<script setup lang="ts">
import { computed } from 'vue';
import './MoveMask.scss'
import { getItemSizeStyle } from '../../help/drag.ts';

const props = withDefaults(
	defineProps<{
		/** 容器格子宽 */
		width: number;
		/** 容器格子高 */
		height: number;
		/** 格子间隔 */
		gap: number;
		/** 拖拽元素列数 */
		w: number;
		/** 拖拽元素行数 */
		h: number;
		/** 拖拽元素 x 坐标 */
		x: number;
		/** 拖拽元素 y 坐标 */
		y: number;
		/** 是否可以放置 */
		isPutDown: boolean;
	}>(),
	{
		width: 0,
		height: 0,
		gap: 0,
		w: 0,
		h: 0,
		x: 0,
		y: 0,
		isPutDown: false,
	}
);

const maskStyle = computed(() => getItemSizeStyle(props.width, props.height, props.x, props.y, props.gap, props.w, props.h));
// grid-area 无过渡动画
// {
// 'grid-area': `${props.y + 1} / ${props.x + 1} / ${props.y + props.h + 1}/ ${
//   props.x + props.w + 1
// }`,
// }
</script>
<template>
	<div class="move-mask" :style="maskStyle">
		<slot>
			<div
				class="move-mask__default"
				:style="{
					backgroundColor: props.isPutDown ? '#2867f91c' : '#ff00001c',
					borderColor: props.isPutDown ? '#2c68f3' : '#ff000079',
				}"
			></div>
		</slot>
	</div>
</template>

