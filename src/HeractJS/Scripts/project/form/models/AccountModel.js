/**
 * Developer: Roman Shumskiy
 * Date: 08/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define */

define([],
    function () {
        'use strict';
        return Backbone.Model.extend({
            initialize: function (account) {
                this.url = this.urlRoot + '/' + account.userId;
                this.fetch();
            },
            urlRoot: "/Elegance/GetAccountData",
            parse: function (resp) {
                var data = this.prepareData(resp.data);
                return data;
            },
            prepareData: function(data){
                if(data.phone){
                    data = this.preparePhoneNumber(data);
                }
                data.avatarUri = data.userpicUri;
                return data;
            },

            preparePhoneNumber: function(data){
                var phone = data.phone;
                var phoneNumber = phone;
                var phoneLink = phone.replace(/((\+))|(-)|(\()|(\))/g, '');
                data.phoneLink = phoneLink;
                data.phoneNumber = phoneNumber;
                return data;
            }
        });
    });