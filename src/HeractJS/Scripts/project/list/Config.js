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

define(['listInitializer'], function(listInitializer) {
    
    return {
        id: 'module:grid',
        module: listInitializer,
        navigationUrl: {
            default: 'list'
        },
        routes: {
            'list': 'navigate'
        }
    }
});
