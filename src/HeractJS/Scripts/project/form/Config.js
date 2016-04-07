/**
 * Developer: Daniil Korolev
 * Date: 1/4/2016
 * Copyright: 2009-2016 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define(['./Initializer'], function (formInitializer) {
    return {
        id: 'module:form',
        module: formInitializer,
        navigationUrl: {
            default: 'form'
        },
        routes: {
            'form': 'navigate'
        }
    }
});
