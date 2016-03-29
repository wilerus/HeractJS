var globalStore = (function () {
    function globalStore() {
    }
    globalStore.svgGridWidth = 50;
    globalStore.cellCapacity = 24;
    globalStore.cellSize = 50 / 24;
    return globalStore;
})();
exports.globalStore = globalStore;
