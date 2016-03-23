/**
 * Developer: Denis Krasnovskiy
 * Date: 9/01/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, _, $ */

define(['coreui'],
    function(core) {
        'use strict';

        var helpers = {
            systemNameFiltration: function(unfiltredText) {
                var regText = unfiltredText.replace(/[\W]/gi, ''),
                    arrText = [],
                    i;

                for (i = 0; i < regText.length; i++) {
                     arrText.push(regText[i]);
                }

                for (i = 0; i < arrText.length; i++) {
                    if (parseInt(arrText[i])) {
                        arrText.splice(i, 1);
                        i--;
                    } else {
                        return arrText.toString().replace(/,/gi, '');
                    }
                }
            },

            redirect: function() {
                this.title = Localizer.get('CORE.SERVICES.MESSAGE.TITLE.ACCESSDENIED');
                this.description = Localizer.get('CORE.SERVICES.MESSAGE.DESCRIPTION.ACCESSDENIEDDESCRIPTION');
                this.button = [
                    {
                        id: false,
                        text: Localizer.get('CORE.SERVICES.MESSAGE.BUTTONS.RETURN'),
                        default: true
                    }
                ];

                core.services.MessageService.showMessageDialog(this.description, this.title, this.button).then(function () {
                    this.location = window.location;
                    if (this.location.origin) {
                        this.location.href = this.location.origin;
                    } else {
                        this.location.href = this.location.protocol + '//' + this.location.host;
                    }
                }.bind(this));
            },

            parseResponse: function (response) {
                var responseJSON = response.responseJSON,
                    extraData = responseJSON.extraData,
                    exception = responseJSON.exceptionCode;

                return { extraData: extraData, message: Localizer.get('PROCESS.RECORDTYPES.RECORDS.ATTRIBUTEVALUEISNOTUNIQUE')[exception] };
            }
        }
        return helpers;
    });