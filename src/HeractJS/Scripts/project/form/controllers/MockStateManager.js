define(['form/App'],
    function (App) {
        return Marionette.Controller.extend({
            updateForm: function () {
                this.trigger("updateForm", "mockAppId");
            }
        });
    });