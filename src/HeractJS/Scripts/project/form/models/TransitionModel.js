/**
 * Developer: Daniil Korolev
 * Date: 21/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, $ */

define(['../App'],
    function (App) {
        'use strict';
        return Backbone.Model.extend({
            url: '/EleganceUserObject/GetItemTransition/',

            getTransition: function (transitionInfo) {
                var self = this;
                $.get(this.url, transitionInfo).done(function (resp) {
                    self.set(resp.data);
                    self.set('formId', transitionInfo.id);
                    self.__handleLoadedData();
                });
            },

            __handleLoadedData: function () {
                if (this.get('haveLetters')) {
                    App.FormMediator.showLetterSettings(this);
                } else {
                    App.FormMediator.performTransition({ id: this.get('formId'), transitionId: this.get('transitionId') });
                }
            }
        });
    });