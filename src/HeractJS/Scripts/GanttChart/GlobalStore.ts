import React = require('react')

export class GlobalStore {
   static isCurrentlyDragging: boolean
   static isDrawingConnection: boolean
   static isCurrentlySizing: boolean

   static isLineDrawStarted: boolean

   static timelineStep: number

   static svgGridWidth: number = 50
   static ganttChartView: any
   static cellCapacity: number = 50 / 24
   
   static currentDropTarget: React.Component<any, any>
   static currentDraggingElement: React.Component<any, any>

   static tempLine: any
}