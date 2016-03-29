/**
 * Created by admin on 10/20/2015.
 */

define(['./tpl/ProfileAboutAndExtras.hbs'], function (template) {
    return Marionette.ItemView.extend({
        className: 'one-column-wrp_about-and-extra',
        template: template,

        setModuleLoading: function() {

        }

    });
});
