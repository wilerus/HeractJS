// simulating server data
// initial set up

export class ChartBarItems <TData>{
    id: string
    order: number
    collapsed: boolean
    position: number

    name: string
    description: string
    assignee: string
    parent: string
    predecessors: string

    progress: number
    duration: number
    startDate: number
    finish: number
    priority: string

    constructor(taskData) {
        this.id = taskData.id;
        this.order = taskData.order;
        this.collapsed = taskData.collapsed;
        this.position = taskData.position;

        this.name = taskData.name;
        this.description = taskData.description;
        this.assignee = taskData.assignee;
        this.parent = taskData.parent;
        this.predecessors = taskData.predecessors;

        this.progress = taskData.progress;
        this.duration = taskData.duration;
        this.startDate = taskData.startDate;
        this.finish = taskData.finish;
        this.priority = taskData.priority;
    }
}