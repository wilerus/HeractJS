define([
    'comindware/core',
    './template/Chart.html'
], function (object, template) {
    return Marionette.ItemView.extend({
        initialize: function () {
        },
        className: "marionetteTutorialRegion",
        template: Handlebars.compile(template),
    })
})
            