/**
 * Developer: Oleg Verevkin
 * Date: 27.09.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import chatikInitializer from 'chatikInitializer';

export default {
    id: 'module:chatik',
    module: chatikInitializer,
    navigationUrl: {
        default: 'chatik'
    },
    routes: {
        'chatik': 'navigate'
    }
};
