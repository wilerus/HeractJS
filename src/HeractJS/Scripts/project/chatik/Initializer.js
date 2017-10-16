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
import ChatikView from './views/chatik/ChatikView';

export default Core.Controller.extend({
    initialize() {
      this.listenTo(this.view, 'websoket:message', this.__handleBigButtonEvent);
      this.viewModel = new Backbone.Collection();
    },

    contentView: ContentView,

    navigate() {
        const chatikView = new ChatikView({collection: this.viewModel});
        this.moduleRegion.show(chatikView);
        this.listenTo(chatikView, 'send:message', this.__handleBigButtonEvent);
    },

    eventsHandlers: {
        onWebSocketMessage(data) {
            this.__addMessages(data);
        }
    },

    __handleBigButtonEvent(data) {
        this.sendWebSocketMessage(data);
    },

    __addMessages(data) {
        this.viewModel.add(data);
    }
});
