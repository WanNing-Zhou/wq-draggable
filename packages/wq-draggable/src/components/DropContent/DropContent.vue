<script setup lang="ts">
import {computed, onBeforeUnmount, reactive, ref} from 'vue';
import './DropContent.scss'
import {booleanIntersects, booleanWithin, useDragStore, useBoxGrid, DragPosition} from '../../help/drag.ts';
import {vSize} from "../../help/directives.ts";
import PreviewItem from '../PreviewItem/PreviewItem.vue';
import MoveMask from '../MoveMask/MoveMask.vue';
import {DragId, DragItem as DragItemData} from '../../help/types.ts';
import {ceil} from "../../help/utils.ts";

type CallbackFun = (e: DragItemData | any, list: DragItemData[]) => Promise<boolean> | boolean;

const emits = defineEmits(['update:modelValue']);
const props = withDefaults(
	defineProps<{
		modelValue: DragItemData[];
		/** 拖拽分组标识 */
		groupName?: string;
		/** 容器需要分隔列数 */
		column?: number;
		/** 容器需要分隔行数 */
		row?: number;
		/** 容器格子间隔 */
		gap?: number;
		/** 是否显示拖拽预占位层 */
		mask?: boolean;
		/** 放置前的钩子 如果返回 false 则取消放置 */
		beforeDrop?: CallbackFun;
		/** 删除前的钩子 如果返回 false 则取消删除 */
		beforeRemove?: CallbackFun;
	}>(),
	{
		groupName: 'DragDrop',
		column: 0,
		row: 0,
		gap: 0,
		mask: true,
		beforeDrop: () => true,
		beforeRemove: () => true,
	}
);

const list = computed({
	get: () => props.modelValue,
	set: (val) => emits('update:modelValue', val),
});

const groupKey = Symbol()

const designerContentRef = ref<HTMLElement>();
const { columnCount, rowCount } = useBoxGrid(list, props.column, props.row);


const contentSize = reactive({
  width: 0,
  height: 0,
})
// gird 格子
 const boxSize = computed(()=> {
  return {
    width: (contentSize.width - props.gap * (props.column - 1)) / props.column,
    height: (contentSize.height - props.gap * (props.row - 1)) / props.row,
  }
});

const dragStore = useDragStore()

const copyCallback  = (data: any) => {
  if (data && data.id) {
    list.value = list.value.filter((item) => item.id !== data.id);
  }
}
dragStore.setContentData({
  key: groupKey,
  group: props.groupName,
  copyCallback: copyCallback
})
onBeforeUnmount(() => {
  dragStore.unsetContentData(groupKey)
})

// 拖拽中的元素
const current = reactive({
	show: <boolean>false,
	id: <undefined | DragId>undefined,
	w: <number>0, // 宽
	h: <number>0, // 高
	x: <number>0, // 列
	y: <number>0, // 行
});

// 是否可以放置
const isPutDown = computed(() => {
	const currentXy = [current.x, current.y, current.x + current.w, current.y + current.h] as DragPosition;
	return (
		booleanWithin([0, 0, columnCount.value, rowCount.value], currentXy) &&
		list.value.every((item) => item.id === current.id || !booleanIntersects([item.x, item.y, item.x + item.w, item.y + item.h], currentXy))
	);
});

// 删除行
const isDelRow = computed(() => {
	const rows = Math.max(props.row, rowCount.value - 1);
	return list.value.every((item) => item.y + item.h <= rows);
});

// 计算 x 坐标
const getX = (num: any) => parseInt(String(num / (boxSize.value.width + props.gap)));
// 计算 y 坐标
const getY = (num: any) => parseInt(String(num / (boxSize.value.height + props.gap)));
// 计算列数
const getColumn = (num: any) => ceil(num / (boxSize.value.width + props.gap));
// 计算行数
const getRow = (num: any) => ceil(num / (boxSize.value.height + props.gap));

const gridStyle = computed(() => {
  return {
    'row-gap': `${props.gap}px`,
    'column-gap': `${props.gap}px`,
    'grid-template-columns': `repeat(${columnCount.value}, ${boxSize.value.width}px)`,
    'grid-template-rows': `repeat(${rowCount.value}, ${boxSize.value.height}px)`,

  }
})

// 进入放置目标
const onDragenter = (e: any) => {
	e.preventDefault();
	const dragData = dragStore.get(props.groupName);
	if (dragData) {
		current.w = dragData.w;
		current.h = dragData.h;
		current.x = getX(e.offsetX) - getX(dragData?.offsetX ?? 0);
		current.y = getY(e.offsetY) - getY(dragData?.offsetY ?? 0);
		current.id = dragData.id;
		current.show = true;
	}
};

// 在目标中移动
const onDragover = (e: any) => {
	e.preventDefault();
	const dragData = dragStore.get(props.groupName);
	if (dragData) {
		current.x = getX(e.offsetX) - getX(dragData?.offsetX ?? 0);
		current.y = getY(e.offsetY) - getY(dragData?.offsetY ?? 0);
	}
};

// 离开目标
const onDragleave = (e: any) => {
	e.preventDefault();
	current.show = false;
	current.id = undefined;
};

// 放置在目标上
const onDrop = async (e: any) => {
	e.preventDefault();
	current.show = false;
	const dragData = dragStore.get(props.groupName); // JSON.parse(e.dataTransfer.getData('application/json'))
  if (
		isPutDown.value &&
		(await props.beforeDrop(
			{
				...dragData,
				x: current.x,
				y: current.y,
			},
			list.value
		))
	) {
    const tData = list.value.find((item) => item.id === dragData.id)
    // 判断该元素是否已经存在
    if(tData) {
      tData.x = current.x;
      tData.y = current.y;
    }else {
      // 当groupKey存在时, 则来源于其他组件
      const itemData = {...dragData, x: current.x, y: current.y,} as any
      delete itemData.gourpKey;
      if(dragData?.groupKey){
        const orgData = dragStore.getContentData(dragData.groupKey)
        orgData.copyCallback(dragData)
      }
      list.value.push({
        ...itemData,

        // id: new Date().getTime(),
        id: itemData.id || Symbol(),
      });
    }

		// if (dragData.id) {
		// 	dragData.x = current.x;
		// 	dragData.y = current.y;
		// } else {
		// 	list.value.push({
		// 		...dragData,
		// 		x: current.x,
		// 		y: current.y,
		// 		// id: new Date().getTime(),
		// 		id: Symbol(),
		// 	});
		// }
	}
};

// 删除元素
const onRemovePreviewItem = (el) => {
	if (props.beforeRemove(el, list.value)) {
		list.value = list.value.filter((item) => item !== el);
	}
};

// 调整大小开始
const onResizeStart = () => {
	const dragData = dragStore.get(props.groupName);
	if (dragData) {
		current.w = dragData.w;
		current.h = dragData.h;
		current.x = dragData.x;
		current.y = dragData.y;
		current.id = dragData.id;
		current.show = true;
	}
};

// 调正大小时
const onResizing = (e) => {
	current.w = getColumn(e.width);
	current.h = getRow(e.height);
};

// 调整大小结束
const onResizeEnd = async () => {
	current.show = false;
	const dragData = dragStore.get(props.groupName);
	if (
		isPutDown.value &&
		(await props.beforeDrop(
			{
				...dragData,
				w: current.w,
				h: current.h,
			},
			list.value
		))
	) {
		dragData.w = current.w;
		dragData.h = current.h;
	}
};

defineExpose({
	// 添加行
	addRow: () => (rowCount.value = rowCount.value + 1),
	// 删除行
	deleteRow: () => isDelRow.value && (rowCount.value = Math.max(props.row, rowCount.value - 1)),
});
</script>
<template>
	<div v-size="contentSize" ref="designerContentRef" class="drop-content">
		<div
			class="drop-content__drop-container"
			@dragenter="onDragenter($event)"
			@dragover="onDragover($event)"
			@dragleave.stop="onDragleave($event)"
			@drop="onDrop($event)"
      :style="gridStyle"
		>
			<template v-for="x in rowCount">
				<div class="bg-column" v-for="y in columnCount" :key="`${x}-${y}`"></div>
			</template>
		</div>
		<div class="drop-content__preview">
			<PreviewItem
				v-for="item in list"
				:key="item.id"
				:data="item"
				:group-name="groupName"
        :groupKey="groupKey"
				:style="{
					pointerEvents: current.show && item.id !== current.id ? 'none' : 'all',
					...gridStyle
				}"
				@close="onRemovePreviewItem(item)"
				@resize-start="onResizeStart"
				@resizing="onResizing"
				@resize-end="onResizeEnd"
			>
				<slot name="preview-item" :data="item" :moving="current.show && item.id !== current.id"></slot>
			</PreviewItem>
			<MoveMask
				v-if="mask"
				v-show="current.show"
				v-bind="current"
				:width="boxSize.width"
				:height="boxSize.height"
				:gap="gap"
				:is-put-down="isPutDown"
			>
				<slot name="move-mask" v-bind="current" :is-put-down="isPutDown"></slot>
			</MoveMask>
		</div>
	</div>
</template>
