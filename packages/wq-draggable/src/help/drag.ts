
import { onUnmounted, Ref, ref, watch } from 'vue';
import {ContentData, DragItem} from "./types";

interface CurrentDragData extends DragItem {
    offsetX?: number;
    offsetY?: number;
    groupKey?: symbol;
}

class DragStore<T extends CurrentDragData> {
    moveItem = new Map<string, T>();
    contentData = new Map<symbol, ContentData>()

    set(key: string, data: T) {
        this.moveItem.set(key, data);
    }

    remove(key: string) {
        this.moveItem.delete(key);
    }

    get(key: string): undefined | T {
        return this.moveItem.get(key);
    }

    setContentData(data: { key: symbol; group: string; copyCallback: (data: any) => void }) {
        this.contentData.set(data.key, {
            group: data.group,
            copyCallback: data.copyCallback,
        });
    }
    unsetContentData(key: symbol) {
        this.contentData.delete(key);
    }
    getContentData(key: symbol): ContentData | undefined {
        return this.contentData.get(key);
    }
    copy(key: symbol, data: any) {
        const contentData = this.getContentData(key);
        if (contentData) {
            contentData.copyCallback(data);
        }
    }
}

/**
 * 拖拽临时数据
 */
 const dragStore = new DragStore<CurrentDragData>();
/**
 * 拖拽数据
 */
export const useDragStore = () => {
    return dragStore;
}


export type DragPosition = [number, number, number, number]

/**
 * 判断是否在当前四边形内
 * @param {*} p1 父容器
 * @param {*} p2
 * @returns
 *  对应是 左上角坐标 和 右下角坐标
 *  [0,0,1,1]  => 左上角坐标 0,0  右下角 1,1
 */
export const booleanWithin = (p1: [number, number, number, number], p2: [number, number, number, number]) => {
    return p1[0] <= p2[0] && p1[1] <= p2[1] && p1[2] >= p2[2] && p1[3] >= p2[3];
};

/**
 * 判断是两四边形是否相交
 * @param {*} p1 父容器
 * @param {*} p2
 * @returns
 *  对应是 左上角坐标 和 右下角坐标
 *  [0,0,1,1]  => 左上角坐标 0,0  右下角 1,1
 */
export const booleanIntersects = (p1: [number, number, number, number], p2: [number, number, number, number]) => {
    return !(
        p1[2] <= p2[0] || // p1 在 p2 左边
        p2[2] <= p1[0] || // p1 在 p2 右边
        p1[3] <= p2[1] || // p1 在 p2 上边
        // p1 在 p2 下边
        p2[3] <= p1[1]
    );
};

/**
 * 根据数据生成 Gird 行数和列数
 * @param {*} list 数据源
 * @param {*} minColumn 最小列数
 * @param {*} minRow 最小行数
 * @returns
 */
export const useBoxGrid = (list: Ref<DragItem[]>, minColumn: number, minRow: number) => {
    const columnCount = ref(minColumn);
    const rowCount = ref(minRow);

    const watcher = watch(
        () => list,
        (val) => {
            if (Array.isArray(val)) {
                const x: number[] = [],
                    y: number[] = [];
                val.forEach((item) => {
                    x.push(item.x + item.w);
                    y.push(item.y + item.h);
                });
                // :TODO 这里可以优化一下
                // 获取最大列数和最大行数
                columnCount.value = Math.max(...x, minColumn, columnCount.value);
                rowCount.value = Math.max(...y, minRow, rowCount.value);
            }
        },
        { immediate: true }
    );

    onUnmounted(() => {
        watcher();
    });

    return {
        columnCount,
        rowCount,
    };
};

/**
 * 获取元素位置信息
 * @param {*} width 格子宽
 * @param {*} height 格子高
 * @param {*} x x 坐标
 * @param {*} y y 坐标
 * @param {*} gap 间隔
 * @param {*} w 元素占列数
 * @param {*} h 元素占行数
 * @returns
 */
export const getItemSizeStyle = (width: number, height: number, x: number, y: number, gap: number, w: number, h: number) => {
    const transformY = height * y + y * gap;
    const transformX = width * x + x * gap;
    return {
        width: `${width * w + (w - 1) * gap}px`,
        height: `${height * h + (h - 1) * gap}px`,
        transform: `translate(${transformX}px,${transformY}px)`,
    };
};


