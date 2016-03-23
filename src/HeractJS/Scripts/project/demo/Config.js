/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define(['demoInitializer'], {
    id: 'module:demo:core',
    module: require('demoInitializer'),
    navigationUrl: {
        default: 'demo/core',
        case: 'demo/core/:section/:group/:case'
    },
    routes: {
        'demo/core': 'navigate',
        'demo/core/:sectionId/:groupId/:caseId': 'navigateToCase'
    }
});
