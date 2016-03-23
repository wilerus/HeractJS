/**
 * Developer: Denis Krasnovskiy
 * Date: 26.10.2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, _, $ */

define(['coreui'],
    function (core) {
        'use strict';

        return {
            tableComparator2Asc: function (a, b) {
                return this.__compare(a, b);
            },

            tableComparator2Desc: function (a, b) {
               return this.__compare(b, a);
            },

            __compare:function(a, b){
                if (a.length !== 0) {
                    a = a[0].columns[0];
                    if (b.length !== 0) {
                        b = b[0].columns[0];
                        return a.localeCompare(b);
                    } else {
                        return -1;
                    }
                } else if (b.length !== 0) {
                    return 1;
                }
                return 0;
            },

            getComparatorByDataType: function (dataType, sorting) {
                _.bindAll(this, 'tableComparator2Desc', 'tableComparator2Asc');
                return sorting === 'asc' ? this.tableComparator2Asc : this.tableComparator2Desc;
            }
        }
    });