<script setup lang="ts">
import { computed, ref } from 'vue';
import { DragItem as DragItemData } from '../help/types';
import {useDragStore} from "../help/drag";

const emits = defineEmits(['close', 'resize-start', 'resizing', 'resize-end']);

const props = withDefaults(
	defineProps<{
		/** 元素放置信息 */
		data: DragItemData;
		/** 拖拽分组标识 */
		groupName?: string;
    groupKey?: symbol;
	}>(),
	{
		groupName: 'DragDrop',
	}
);

const moving = ref(false);
const resizing = ref(false);

const dragStore = useDragStore()

const previewStyle = computed(() => {
	return {
		'grid-area': `${props.data.y + 1} / ${props.data.x + 1} / ${props.data.y + props.data.h + 1}/ ${props.data.x + props.data.w + 1}`,
		...(moving.value
			? {
					opacity: 0,
					// 将当前元素移出容器外,将元素占位空置出来
					transform: `translate(-999999999px, -9999999999px)`,
			  }
			: {}),
		...(resizing.value ? { opacity: 0.5 } : {}),
	};
});

const onDragstart = (e:DragEvent) => {
  e.stopPropagation()
  const target = e.target as HTMLElement;
	const data = {...props.data, offsetX: e.offsetX, offsetY: e.offsetY, groupKey: props.groupKey}
	dragStore.set(props.groupName, data);
	// 拖拽开始立刻设置 opacity: 0 会导致拖拽默认样式也会为 opacity: 0 , 需要延迟设置
	setTimeout(() => (moving.value = true));
	unset(target);
};

const onDragend = (e) => {
	moving.value = false;
	dragStore.remove(props.groupName);
};

const onMousedown = (e:MouseEvent) => {
	dragStore.set(props.groupName, props.data);
	emits('resize-start');
	resizing.value = true;

  const target = e.target as HTMLElement;

	target.onmousemove = function (event:MouseEvent) {
    const cTarget = event.target as HTMLElement;
		emits('resizing', {
			width: cTarget.offsetWidth,
			height: cTarget.offsetHeight,
		});
	};

	target.onmouseup = function (event) {
    const cTarget = event.target as HTMLElement;
		unset(cTarget);
		emits('resize-end');
		cTarget.style.width = '100%';
		cTarget.style.height = '100%';
		dragStore.remove(props.groupName);
	};
};

const unset = (target: HTMLElement) => {
	resizing.value = false;
	target.onmousemove = null;
	target.onmouseup = null;
};
</script>

<template>
	<div class="preview-item" :style="previewStyle" draggable="true" @dragstart.stop="onDragstart" @dragend.stop="onDragend" @mousedown.stop="onMousedown">
		<slot>
			<div class="preview-item__default"></div>
		</slot>
		<slot name="close">
			<div class="close-btn" @click.stop.prevent="$emit('close')"></div>
		</slot>
	</div>
</template>
<style lang="scss" scoped>
.preview-item {
	position: relative;
	box-sizing: border-box;
	//overflow: hidden;
	pointer-events: all;
	opacity: 1;
	user-select: none;
	overflow: auto;
	resize: both;

	&__default {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		user-select: none;
		box-sizing: border-box;
		border-radius: 6px;
		background-color: #efefef;
		border: 2px solid #2c68f325;
		&:hover {
			border-color: #2c68f399;
			transition: all 0.2s;
		}
	}

	&__move {
		position: absolute;
		cursor: nwse-resize;
		right: 0;
		bottom: 0;
		width: 20px;
		height: 20px;
		background: red;
	}

	.close-btn {
		position: absolute;
		cursor: pointer;
		right: 4px;
		top: 4px;
		height: 20px;
		width: 20px;

		&:after,
		&:before {
			content: '';
			background: #666;
			width: 16px;
			height: 2px;
			margin: auto;
			position: absolute;
			top: 0;
			bottom: 0;
			right: 0;
			left: 0;
		}
		&:before {
			transform: rotate(-225deg);
			top: 0;
		}
		&:after {
			transform: rotate(225deg);
			top: 0;
		}
	}
}
</style>
