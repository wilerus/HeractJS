export class ScrollBarMediator {
    private subscribersCallback: any;
    private static _instance: ScrollBarMediator;

    constructor() {
        this.reset();
    }

    reset() {
        this.subscribersCallback = {};
    }

    public static getInstance(): ScrollBarMediator {
        if (this._instance === null || this._instance === undefined) {
            this._instance = new ScrollBarMediator();
        }
        return this._instance;
    }

    public unsubscribe(subscriber) {
        delete this.subscribersCallback[subscriber];
    }

    // @param {Object} position  { oldPosition, position }
    public change(position) {
        for (var subscriber in this.subscribersCallback) {
            this.subscribersCallback[subscriber].call(this, position);
        }
    }

    public onChanged(subscriber, callback) {
        this.subscribersCallback[subscriber] = callback;
    }
}