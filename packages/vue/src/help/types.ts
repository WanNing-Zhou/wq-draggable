// 用于拖拽时的唯一标识
export type DragId = string | symbol | number

export interface DragItem {
    id: DragId
    x: number
    y: number
    h: number
    w: number
    static?: boolean
}

export interface ContentData {
    group: string; // 分组名
    copyCallback: (item: DragItem) => void; // 复制回调
}