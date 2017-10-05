/**
 * Developer: Oleg Verevkin
 * Date: 14.12.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import template from '../templates/noList.html';

export default Marionette.ItemView.extend({
    className: 'empty-view',
    
    template: Handlebars.compile(template)
});
