
export class globalStore {
    startPointX: number
    startPointY: number
    endPointX: number
    endPointY: number
    isNewConnection: boolean

    isCurrentlyDragging: boolean
    isCurrentlySizing: boolean

    isLineDrawStarted: boolean

    connectionFirstPoint: any
    connectionEndPoint: any

    currentDropTarger: any
    currentDraggingElement: any

    newSvgPaletId: number
    tempLine: any
    tempFunc: any

    constructor() {
        this.newSvgPaletId = 0
    }
}