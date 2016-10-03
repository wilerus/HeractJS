define([
    'comindware/core'
], function () {
    return Marionette.ItemView.extend({
        initialize: function () {
        },
        template: Handlebars.compile("<div class = chart-test-region>some text</div>")
    })
})
            