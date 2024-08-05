<script setup lang="ts">
import './DragItem.scss'
import { useDragStore} from '../../help/drag.ts';
import { DragId} from "../../help/types.ts";

const props = withDefaults(
	defineProps<{
		data: {id?:DragId, w: number, h: number};
		/** 拖拽分组标识 */
		groupName?: string;
	}>(),
	{
		groupName: 'DragDrop',
	}
);

const dragStore = useDragStore()
const onDragstart = () => dragStore.set(props.groupName, { ...props.data } as any);
const onDragend = () => dragStore.remove(props.groupName);
</script>
<template>
	<div class="drag-item">
		<div class="drag-item__el" draggable="true" @dragstart="onDragstart" @dragend="onDragend">
			<slot></slot>
		</div>
	</div>
</template>
