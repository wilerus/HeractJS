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

import ContentView from './views/ContentView';

export default Core.Controller.extend({
    initialize() {
      this.listenTo(this.view, 'websoket:message', this.__handleBigButtonEvent);
    },

    contentView: ContentView,

    navigate() {
        //this.moduleRegion.show(new ContentView({}));
    },

    eventsHandlers: {
        onWebSocketMessage(data) {
            console.log(data);
        }
    },

    __handleBigButtonEvent(data) {
        this.sendWebSocketMessage(data);
    }
});
