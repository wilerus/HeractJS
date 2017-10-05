define([],
    function () {
        'use strict';
        return Backbone.Model.extend({
            defaults: {
                data: [
                    {
                        "label": "Group A",
                        "value": 15
                    },
                    {
                        "label": "Group B",
                        "value": 39.5
                    },
                    {
                        "label": "Group C",
                        "value": 0.8
                    },
                    {
                        "label": "Group D",
                        "value": 90
                    },
                    {
                        "label": "Group E",
                        "value": 97.5
                    }],
                config: {
                    x: function (d) { return d.label },
                    y: function (d) { return d.value },
                    duration: 750,
                    margin: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50                           
                    },
                    showLabels: true,
                    title: "Donut Chart",
                    labelsOutside: true,
                    donut: true,
                    width: 700,
                    height: 700,
                    showLegend: true
                }
            }
            
        });
    });