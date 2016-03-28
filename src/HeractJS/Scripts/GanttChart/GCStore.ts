
export class globalStore {
   static startPointX: number
   static startPointY: number
   static endPointX: number
   static endPointY: number
   static isNewConnection: boolean

   static isCurrentlyDragging: boolean
   static isDrawingConnection: boolean
   static isCurrentlySizing: boolean

   static isLineDrawStarted: boolean

   static timelineStep: number

   static svgGridWidth: number = 50
   static ganttChartView: any
   static cellCapacity: number = 24

   static connectionFirstPoint: any
   static connectionEndPoint: any

   static currentDropTarget: any
   static currentDraggingElement: any

   static newSvgPaletId: number
   static tempLine: any
   static tempFunc: any
}