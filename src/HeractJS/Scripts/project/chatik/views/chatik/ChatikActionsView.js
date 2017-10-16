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
    className: 'chatik-actions-container',

    template: Handlebars.compile(
        `<input type='text' class='js-message-input chatik-message-input'>
        <button class="js-message-send-button button-send-message">➤</button>`),

    ui: {
        messageInput: '.js-message-input',
        messageButton: '.js-message-send-button'
    },

    events: {
        'click @ui.messageButton': '__handleMessage',
        'keypress @ui.messageInput': '__handleInputKeypress'
    },

    __handleMessage(data) {
        this.trigger('send:message', this.ui.messageInput.val());
        this.ui.messageInput.val('');
    },

    __handleInputKeypress(e) {
        if (e.which === 13) {
            this.trigger('send:message', this.ui.messageInput.val());
            this.ui.messageInput.val('');
        }
    }
});
