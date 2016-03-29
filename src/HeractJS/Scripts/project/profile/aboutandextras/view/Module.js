/**
 * Created by admin on 10/20/2015.
 */

define(['./tpl/ProfileAboutAndExtras.html'], function(template) {
    return Marionette.ItemView.extend({
        className: 'one-column-wrp_about-and-extra',
        template: Handlebars.compile(template),

        setModuleLoading: function() {

        }

    });
});
