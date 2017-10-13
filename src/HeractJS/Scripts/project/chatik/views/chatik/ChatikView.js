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

import ChatikListView from './ChatikListView';
import ChatikActionsView from './ChatikActionsView';

export default Marionette.LayoutView.extend({
    className: 'chatik-view',

    template: Handlebars.compile(
        `<div class="js-list-region chatik-list-region"></div>
        <div class="js-message-region chatik-message-region"></div>`),

    regions: {
        listRegion: '.js-list-region',
        messageRegion: '.js-message-region'
    },

    onRender() {
        const actionsView = new ChatikActionsView();
        this.listRegion.show(new ChatikListView(this.getOption('collection')));
        this.messageRegion.show(actionsView);
        this.listenTo(actionsView, 'send:message', this.__handleMessage);
    },

    __handleMessage(data) {
        this.trigger('send:message', data);
    }
});
