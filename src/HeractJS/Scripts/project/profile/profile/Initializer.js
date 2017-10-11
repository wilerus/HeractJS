define([
    'shared'
], function(shared) {
    'use strict';


    var ProfileInfoModule = Core.Controller.extend({
        layout : 'ProfileLayout',
        helpTopicId: 'PROFILE.PROFILE',

        onDestroy: function () {
            this.scroller && this.scroller.destroy();
        },

        showProfile: function () {
            var userId = _.getWindowPropIfHas('shared.services.CacheService.CurrentUser.Id'),
                layout = this.contentRegion.el;
            var $scrollerRenderTo = $("<div/>").addClass("one-column-wrp profile-container")
                .appendTo(layout);
            var $renderTo = $('<div/>').addClass('one-column-content').appendTo($scrollerRenderTo);
            if (userId) {
                var usersModule = ClassLoader.createNS("app.people.users");
                if (!usersModule.Form)
                    throw "form in profile is not defined";

                Ajax.People.UserProfile(userId, false, {
                    success: function(data) {
                        $renderTo.html(data);

//                        var form = usersModule.Form.lastForm;
//                        form.on("submitChanges", function(changes, callback, failcallback) {
//                            var data = this.getPurifiedData();
//                            if (data.id != null) {
//                                Ajax.People.EditUserProfile(data, null, function () {
//                                    callback && callback();
//                                });
//                            }
//
//                            return false;
//                        });
//
//                        var scroller = this.scroller = new sharedViewNs.behaviors.ContentScroller({
//                            $contentArea: $renderTo,
//                            $scrollArea: $(layout)
//                        });
//                        var scrollerUpdate = function (scrollToTop) {
//                                if (scrollToTop === null)
//                                    scrollToTop = true;
//                                scroller.update(scrollToTop);
//                            },
//                            scrollDown = function (el) {
//                                scroller.scrollToBottom();
//                            },
//                            scrollTo = function (el) {
//                                scroller.scrollToElement($(el.renderTo));
//                            };
//
//                        form.on("inputResize", scrollerUpdate);
//                        form.on("scrollDown", scrollDown);
//                        form.on("scrollTo", scrollTo);
//
//                        scrollerUpdate();
                    },
                    ownHandler: true,
                    dataType: 'html'
                });
            }
        }
    });

    return ProfileInfoModule;
});