
export class globalStore {
   static isCurrentlyDragging: boolean
   static isDrawingConnection: boolean
   static isCurrentlySizing: boolean

   static isLineDrawStarted: boolean

   static timelineStep: number

   static svgGridWidth: number = 50
   static ganttChartView: any
   static cellCapacity: number = 24
   static cellSize: number = 50/24

   static connectionFirstPoint: any
   static connectionEndPoint: any

   static currentDropTarget: any
   static currentDraggingElement: any

   static newSvgPaletId: number
   static tempLine: any
   static tempFunc: any
}