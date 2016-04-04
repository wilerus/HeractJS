/**
 * Developer: Roman Shumskiy
 * Date: 29/3/2014
 * Copyright: 2009-2016 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define(['ganttInitializer'], function (gantInitializer) {
    
    return {
        id: 'module:gantt',
        module: gantInitializer,
        navigationUrl: {
            default: 'gantt'
        },
        routes: {
            'gantt': 'navigate'
        }
    }
});
