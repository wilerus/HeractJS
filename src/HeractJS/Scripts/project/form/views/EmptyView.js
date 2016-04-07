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
        return Marionette.CompositeView.extend({
            initialize: function (options) {
                if(options && options.mode == 'attachments'){
                    this.template = Handlebars.compile("<div class='empty-form__txt'>{{localize 'ELEGANCE.FORM.EMPTYATTACHMENTSCONTENT'}}</div>");
                } else {
                    this.template = Handlebars.compile("<div class='empty-form__txt'>{{localize 'ELEGANCE.FORM.EMPTYFORMCONTENT'}}</div>");
                }
            },
            className: 'empty-form'
        });
    });
