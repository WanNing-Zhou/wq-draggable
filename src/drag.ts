
//  Grid布局
export interface GridLayout {
    // x坐标
    x: number,
    // y坐标
    y: number,
    // 高度
    h: number,
    // 宽度
    w: number,
}

// 定位布局
export interface PositionLayout {
    // x坐标
    x: number,
    // y坐标
    y: number,
    // 宽度
    w: number,
    // 高度
    h: number,
}


export interface DragItem {
    // 唯一标识
    key: string,
    // grid 布局位置
    gridLayout?: GridLayout,
    // 定位布局位置
    positionLayout?: PositionLayout,
}

export interface DragSchema {
    list: DragItem[]
}