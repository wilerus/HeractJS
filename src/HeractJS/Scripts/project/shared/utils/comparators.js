/**
 * Developer: Ksenia Kartvelishvili
 * Date: 18.11.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _, Localizer, Promise */

define(['coreui'],
    function (core) {
        'use strict';

        var recordFormComparator2Asc = function (a, b) {
            if (a.get('isDefault')) {
                return -1;
            }
            if (b.get('isDefault')) {
                return 1;
            }
            return core.utils.comparators.stringComparator2Asc(a.get('name'), b.get('name'));
        };

        var recordFormComparator2Desc = function (a, b) {
            if (a.get('isDefault')) {
                return -1;
            }
            if (b.get('isDefault')) {
                return 1;
            }
            return core.utils.comparators.stringComparator2Desc(a.get('name'), b.get('name'));
        };

        return {
            recordFormComparator2Asc: recordFormComparator2Asc,
            recordFormComparator2Desc: recordFormComparator2Desc
        };
    });
