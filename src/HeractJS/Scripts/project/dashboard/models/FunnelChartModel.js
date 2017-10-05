define([],
    function () {
        'use strict';
        return Backbone.Model.extend({
            defaults: {
                data: [{
                    key: 'Series1',
                    values: [
                        {
                            "label": "Group A",
                            "value": 0
                        },
                        {
                            "label": "Group B",
                            "value": 39.5
                        },
                        {
                            "label": "Group C",
                            "value": 80
                        },
                        {
                            "label": "Group D",
                            "value": 90
                        },
                        {
                            "label": "Group E",
                            "value": 97.5
                        }
                    ]
                },
                {
                    key: 'Series2',
                    values: [
                        {
                            "label": "Group A",
                            "value": 100
                        },
                        {
                            "label": "Group B",
                            "value": 121
                        },
                        {
                            "label": "Group C",
                            "value": 40
                        },
                        {
                            "label": "Group D",
                            "value": 20
                        },
                        {
                            "label": "Group E",
                            "value": 5
                        }
                    ]
                }
                ],
                config: {
                    x: function (d) { return d.label },
                    y: function (d) { return d.value },
                    showYAxis: false,
                    showControls:false,
                    duration: 750,
                    margin: { left: 150, right: 150 },
                    showValues: true,
                    showLegend: false,
                    width: 1000,
                    height: 700,
                    stacked: true,
                    barColor: function (d, i) {
                        var colors = d3.scale.category10().range().slice(0);
                        if (d.key == "Series2") {
                            return colors[i];
                        } else {
                            return "#FFFFFF";
                        }
                    }
                }
            }
            
        });
    });