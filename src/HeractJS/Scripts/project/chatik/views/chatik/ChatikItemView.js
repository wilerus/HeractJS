/**
 * Developer: Oleg Verevkin
 * Date: 08.11.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

export default Marionette.ItemView.extend({
    template: Handlebars.compile(
        `<div class="js-content-region">{{message}}</div>
        <div class="js-scrollbar-region">{{dateTime}}</div>`
    )
});
