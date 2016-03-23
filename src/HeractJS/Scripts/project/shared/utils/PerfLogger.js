define(['coreui'], function () {
    'use strict';
    var utils = window.ClassLoader.createNS("shared.utils");

    utils.PerfLogger = function () {
        this.loggerPool = [];
        this.prefix = '|Performance| ';
    };

    utils.PerfLogger.prototype.calculateResults = function (id) {
        if (!window.flag_debug)
            return;

        this.loggerPool[id].runtime = this.loggerPool[id].stopTime - this.loggerPool[id].startTime;
    };

    utils.PerfLogger.prototype.drawToConsole = function (id) {
        window.flag_debug && console.log(this.prefix + id + ' runtime: ' + this.loggerPool[id].runtime);
    };

    utils.PerfLogger.prototype.startTimeLogging = function (id) {
        if (!window.flag_debug)
            return;

        this.loggerPool[id] = {};
        this.loggerPool[id].id = id;
        this.loggerPool[id].startTime = window.performance && performance.now(); // high resolution time support
    };

    utils.PerfLogger.prototype.stopTimeLogging = function (id) {
        if (!window.flag_debug)
            return;

        this.loggerPool[id].stopTime = window.performance && performance.now(); //high resolution time support
        this.calculateResults(id);
    };

    utils.PerfLogger.instance = new utils.PerfLogger();
});
