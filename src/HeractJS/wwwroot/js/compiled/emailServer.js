define('app/settings/emailServer/controller/ModelManager',['module/shared'], function() {
    'use strict';

    var tsNs = window.ClassLoader.createNS("app.settings.emailServer");
    var controllerNs = window.ClassLoader.createNS("app.settings.emailServer.controller");

    controllerNs.ModelManager = function(moduleInstance) {
        this.moduleInstance = moduleInstance;
    };

    controllerNs.ModelManager.prototype = {
        fetchSettings: function() {
           return Ajax.EmailServerSettings.GetSettings({ ownHandler: true });
        },

        editSettings: function (options) {
            return Ajax.EmailServerSettings.EditSettings(options.model.getData(), { ownHandler: true });
        },

        testIncoming: function (options) {
            return Ajax.EmailServerSettings.TestReplyServerSettings(options.model.getData(), {
                ownHandler: true
            });
        },

        testOutgoing: function (options) {
            return Ajax.EmailServerSettings.TestOutgoingServerSettings(options.to, options.model.getData(), { ownHandler: true });
        }
    };
});

define('app/settings/emailServer/model/EmailServerSettings',['module/lib'], function() {
    'use strict';

    var model = window.ClassLoader.createNS("app.settings.emailServer.model");
    var names = window.Context.configurationModel.StaticContext.EmailServerSettingsContext.Names;
    model.EmailServerModel = Backbone.Model.extend({
        initialize: function (attributes, options) {
            Backbone.Model.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
            _.extend(this.unsaved, options ? options.unsaved : {});
        },
        optional: function() {
            return false;
        },
        validateModel: function() {
            var r = [];
            var d = this.getData();
            if (d.enabled) {
                !d.server && r.push('server');
                !d.linkDomain && r.push('linkDomain');
                !d.channelType && r.push('channelType');
                if (d.channelType == names.Exchange) {
                    !d.version && r.push('version');
                    !d.domain && r.push('domain');
                    !d.login && r.push('login');
                    !d.password && r.push('password');
                } else {
                    !d.port && r.push('port');
                    (!d.from || !$.validator.methods.email.call(this, d.from)) && r.push('from');
                    if (d.useAuthentication) {
                        !d.login && r.push('login');
                        !d.password && r.push('password');
                    }
                }
                if (d.replyServerEnabled) {
                    !d.replyServerAddress && r.push('replyServerAddress');
                    !d.replyServerPort && r.push('replyServerPort');
                    !d.replyServerPassword && r.push('replyServerPassword');
                    !d.replyServerLogin && r.push('replyServerLogin');
                    !d.replyServerEncryption && r.push('replyServerEncryption');
                }
            }
            return r;
        },
        parse: function(mdl) {
            !mdl.id && (mdl.linkDomain = window.location.protocol + '//' + window.location.host + '/');
            return mdl;
        },
        getData: function () {
            var data = _.clone(this.attributes);
            if (data.id == 'empty') {
                delete data.id;
            }
            delete data.saved;
            return data;
        },
        set: function (field, value) {
            if (field != 'saved' && this.get(field) != value) {
                this.set('saved', false);
            }
            Backbone.Model.prototype.set.apply(this, arguments);

            delete this.changed.id; //for unsaved exit case
        }
    });
});

define('text-loader!app/settings/emailServer/view/tpl/SmtpServerSettings.html',[],function () { return '<div id="server_cnt" class="card__input card__input_email"></div>\r\n<div id="port_cnt" class="card__input card__input_email"></div>\r\n<div id="timeout_cnt" class="card__input card__input_email"></div>\r\n<div id="enableSsl_cnt"  class="card__input card__input_email label-checkbox" ></div>\r\n<div id="from_cnt" class="card__input card__input_email"></div>\r\n<div id="useAuthentication_cnt" class="card__input card__input_email label-checkbox" ></div>\r\n<div id="authFields">\r\n    <div id="login_cnt" class="card__input card__input_email"></div>\r\n    <div id="password_cnt" class="card__input card__input_email"></div>\r\n</div>\r\n';});


define('app/settings/emailServer/view/FormPartView',['module/lib'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("app.settings.emailServer.view");
    viewNs.FormPartView = function(options) {
        this.options = options;
        this.fields = {};
        this.fieldsEls = {};
    };
    
    _.extend(viewNs.FormPartView.prototype, {
        focusField: function (f) {
            var self = this;
            self.fields[f].focus && window.setTimeout(
                function () {
                    self.fields[f].focus(void 0);
                    self.fields[f].toggle && self.fields[f].toggle();
                }, 0);
        },
        buildFieldsElements: function (fields) {
            var self = this;
            var l1 = Localizer.create(this.options.prefix);
            var l2 = Localizer.create(this.options.prefix2);
            fields.map(function (f) {
                var el = self.$('#' + f + '_cnt');
                var fel = $('<div class="cmw-form-editor"></div>');
                var label = $('<h3 class="h3-card">' + (l1(f.toUpperCase()) || l2(f.toUpperCase())) + '</h3>');
                el.append(label);
                label.on('click', function () { self.focusField(f) });
                self.fieldsEls[f] = fel;
                el.append(fel);
                var tiptxt = f.toUpperCase() + '.TIP';
                tiptxt = l1(tiptxt) || l2(tiptxt);
                if (tiptxt) {
                    el.append($('<div class="wl-info"><span class="tooltip tooltip_server">' + tiptxt + '</span></div>'));
                }
            });
        },
        buildField: function (fname, className, cfg, handler) {
            var self = this;
            cfg = cfg || {};
            cfg = _.extend({
                renderTo: self.fieldsEls[fname][0],
                value: self.model.get(fname)
            }, cfg);
            self.fields[fname] = className(cfg);
            var h = handler || function (nv) {
                self.fieldsEls[fname].removeClass('invalid');
                h !== false && self.model && self.model.set(fname, self.fields[fname].getValue());
            };
            self.fields[fname].on('change', h);
        },
        markInvalid: function (fields) {
            var self = this;
            fields.map(function (f) {
                var fe = self.fieldsEls[f];
                fe && fe.addClass('invalid');
            });
        }
    });
});
define('app/settings/emailServer/view/SmtpServerSettingsView',['module/lib', 'cmwTemplate!app/settings/emailServer/view/tpl/SmtpServerSettings.html', 'app/settings/emailServer/view/FormPartView'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("app.settings.emailServer.view");
    var names = window.Context.configurationModel.StaticContext.EmailServerSettingsContext.Names;

    var smtpFiels = [
        'server',
        'port',
        'enableSsl',
        'timeout',
        'from',
        'useAuthentication',
        'login',
        'password'
    ];

    viewNs.SmtpServerSettingsView = Backbone.Marionette.ItemView.extend({
        template: 'SmtpServerSettings',
        className: 'smtp_server',
        modelEvents: {
            'change:useAuthentication': 'applyUseAuthentication'
        },
        initialize: function() {
            Backbone.Marionette.ItemView.prototype.initialize.apply(this, arguments);
            _.extend(this, new viewNs.FormPartView({ prefix: 'PROJECT.SETTINGS.EMAILSERVERTAB.' }));
        },
        applyUseAuthentication: function () {
            this.model.get('useAuthentication') ? this.$authFields.show() : this.$authFields.hide();
        },
        onRender: function () {
            var self = this;
            self.$authFields = self.$('#authFields');
            this.buildFieldsElements(smtpFiels);
            this.buildField('server', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.SERVER.PLACEHOLDER') });
            this.buildField('port', js.widget.field.number.Number, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.PORT.PLACEHOLDER') });
            this.buildField('enableSsl', js.widget.field.switch.Switch);
            this.buildField('timeout', js.widget.field.number.Number, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.TIMEOUT.PLACEHOLDER') });
            this.buildField('from', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.FROM.PLACEHOLDER') });
            this.buildField('useAuthentication', js.widget.field.switch.Switch);
            this.buildField('login', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.LOGIN.PLACEHOLDER') });
            this.buildField('password', js.widget.field.password.Password, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.PASSWORD.PLACEHOLDER') });
        },
        onShow: function () {
            this.applyUseAuthentication();
        },
        onDestroy: function () {
        }
    });
});

define('text-loader!app/settings/emailServer/view/tpl/ExchangeServerSettings.html',[],function () { return '<div id="version_cnt" class="card__input icon-dropdown card__input_email"></div>\r\n<div id="server_cnt" class="card__input card__input_email"></div>\r\n<div id="domain_cnt" class="card__input card__input_email"></div>\r\n<div id="login_cnt" class="card__input card__input_email"></div>\r\n<div id="password_cnt" class="card__input card__input_email"></div>\r\n';});


define('app/settings/emailServer/view/ExchangeServerSettingsView',['module/lib', 'cmwTemplate!app/settings/emailServer/view/tpl/ExchangeServerSettings.html', 'app/settings/emailServer/view/FormPartView'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("app.settings.emailServer.view");
    var names = window.Context.configurationModel.StaticContext.EmailServerSettingsContext.Names;

    var exchangeFields = [
        'version',
        'server',
        'domain',
        'login',
        'password'
    ];

    viewNs.ExchangeServerSettingsView = Backbone.Marionette.ItemView.extend({
        template: 'ExchangeServerSettings',
        className: 'exchange_server',
        initialize: function () {
            Backbone.Marionette.ItemView.prototype.initialize.apply(this, arguments);
            _.extend(this, new viewNs.FormPartView({ prefix: 'PROJECT.SETTINGS.EMAILSERVERTAB.EXCHANGE', prefix2: 'PROJECT.SETTINGS.EMAILSERVERTAB.' }));
        },
        onRender: function () {
            var self = this;
            this.buildFieldsElements(exchangeFields);
            this.buildField('version', js.widget.field.select.BSelect, {
                allowBlank: false,
                hasFilter: false,
                value: names.Exchange2010sp1,
                items: [{
                    id: names.Exchange2007sp1,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.VERSION.V2007SP1')
                }, {
                    id: names.Exchange2010,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.VERSION.V2010')
                }, {
                    id: names.Exchange2010sp1,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.VERSION.V2010SP1')
                }]
            });
            this.buildField('server', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.EXCHANGESERVER.PLACEHOLDER') });
            this.buildField('domain', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.DOMAIN.PLACEHOLDER') });
            this.buildField('login', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.LOGIN.PLACEHOLDER') });
            this.buildField('password', js.widget.field.password.Password, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.PASSWORD.PLACEHOLDER') });
        },
        onShow: function () {
        },
        onDestroy: function () {
        }
    });
});

define('text-loader!app/settings/emailServer/view/tpl/ImapServerSettings.html',[],function () { return '<h1 class="h1-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.INCOMINGTITLE\')}}}</h1>\r\n<p class="description-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.INCOMINGSUBTITLE\')}}}</p>\r\n<div id="replyServerEnabled_cnt" class="card__input card__input_email label-checkbox"></div>\r\n<div id="reply_settings" class="outgoing_settings">\r\n    <div id="replyServerAddress_cnt" class="card__input card__input_email" ></div>\r\n    <div id="replyServerPort_cnt" class="card__input card__input_email"></div>\r\n    <div id="replyServerLogin_cnt" class="card__input card__input_email"></div>\r\n    <div id="replyServerPassword_cnt" class="card__input card__input_email"></div>\r\n    <div id="replyServerEncryption_cnt" class="card__input icon-dropdown card__input_email"></div>\r\n    <div id="replyServerPollingInterval_cnt" class="card__input card__input_email"></div>\r\n    <button id="testIncoming" class="button-icon button-icon_txt button-icon_run-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.TESTINCOMING\')}}}</button>\r\n    <div id="incomingResult" class="error_testing" style="display:none">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERTESTCONNECTION.SUCCESS\')}}}</div>\r\n</div>\r\n';});


define('app/settings/emailServer/view/ImapServerSettingsView',['module/lib', 'cmwTemplate!app/settings/emailServer/view/tpl/ImapServerSettings.html', 'app/settings/emailServer/view/FormPartView'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("app.settings.emailServer.view");
    var names = window.Context.configurationModel.StaticContext.EmailServerSettingsContext.Names;

    var incomingFields = [
        'replyServerEnabled',
        'replyServerAddress',
        'replyServerPort',
        'replyServerLogin',
        'replyServerPassword',
        'replyServerEncryption',
        'replyServerPollingInterval'
    ];

    viewNs.ImapServerSettingsView = Backbone.Marionette.ItemView.extend({
        template: 'ImapServerSettings',
        className: 'imap_server',
        triggers: {
            'click .button-icon_save': 'emailServerSettings:save',
            'click #testIncoming': 'emailServerSettings:testIncoming'
        },
        modelEvents: {
            'change:replyServerEnabled': 'checkVisible',
            'change:replyServerEncryption': 'applySsl'
        },
        applySsl: function() {
            var v = this.model.get('replyServerEncryption');
            if (v == names.ImapEncryptionTls || v == names.ImapEncryptionSsl) {
                this.fields['replyServerPort'].setValue(993);
                this.model.set('replyServerPort', 993);
            } else if (v == names.ImapEncryptionNone) {
                this.fields['replyServerPort'].setValue(143);
                this.model.set('replyServerPort', 143);
            }
        },
        initialize: function () {
            Backbone.Marionette.ItemView.prototype.initialize.apply(this, arguments);
            _.extend(this, new viewNs.FormPartView({ prefix: 'PROJECT.SETTINGS.EMAILSERVERTAB.' }));
        },
        onRender: function () {
            var self = this;
            self.$fieldsContainer = self.$('#reply_settings');
            this.buildFieldsElements(incomingFields);
            this.buildField('replyServerEnabled', js.widget.field.switch.Switch);
            this.buildField('replyServerAddress', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERADDRESS.PLACEHOLDER') });
            this.buildField('replyServerLogin', js.widget.field.text.Text, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERLOGIN.PLACEHOLDER') });
            this.buildField('replyServerPassword', js.widget.field.password.Password, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERPASSWORD.PLACEHOLDER') });
            this.buildField('replyServerEncryption', js.widget.field.select.BSelect, {
                allowBlank: false,
                hasFilter: false,
                items: [{
                    id: names.ImapEncryptionNone,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERENCRYPTION.NONE')
                }, {
                    id: names.ImapEncryptionTls,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERENCRYPTION.TLS')
                }, {
                    id: names.ImapEncryptionSsl,
                    name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERENCRYPTION.SSL')
                }]
            });
            this.buildField('replyServerPort', js.widget.field.number.Number, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERPORT.PLACEHOLDER') });
            this.buildField('replyServerPollingInterval', js.widget.field.number.Number, { allowBlank: false, EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.REPLYSERVERPOLLINGINTERVAL.PLACEHOLDER') });
        },
        onShow: function () {
            this.checkVisible();
        },
        onDestroy: function () {
        },
        checkVisible: function () {
            this.model.get('replyServerEnabled') ?
                this.$fieldsContainer.show() : this.$fieldsContainer.hide();
            this.trigger('updateScroller');
        }
    });
});

define('text-loader!app/settings/emailServer/view/tpl/EmailServerSettingsInfo.html',[],function () { return '<div id="processing"  class="loading"><span>{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.PROCESSING\')}}}</span></div>\r\n<div class="tr-toolbar">\r\n    <div class="button-icon button-icon_txt button-icon_save button-icon_save-server" title="{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.SAVE\')}}}">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.SAVE\')}}}</div>\r\n</div>\r\n<div id="emailServerInfo" class="email_server-info">\r\n    <h1 class="h1-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.OUTGOINGTITLE\')}}}</h1>\r\n    <p class="description-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.OUTGOINGSUBTITLE\')}}}</p>\r\n    <div id="enabled_cnt" class="card__input card__input_email label-checkbox" />\r\n    <div id="outgoing_settings" class="outgoing_settings">\r\n        <div id="channelType_cnt" class="card__input icon-dropdown card__input_email"/>\r\n        <div id="outgoing_server"/>\r\n        <div id="linkDomain_cnt" class="card__input card__input_email"/>\r\n        <div id="testOutgoingTo_cnt" class="card__input card__input_email" />\r\n        <button id="testOutgoing" class="button-icon button-icon_txt button-icon_run-server">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.TESTOUTGOING\')}}}</button>\r\n        <div id="outgoingResult" class="error_testing" style="display:none">{{{this.Localizer(\'PROJECT.SETTINGS.EMAILSERVERTAB.TESTOUTGOING.SUCCESS\')}}}</div>\r\n    </div>    \r\n    <div id="reply_server" />\r\n</div>';});


define('app/settings/emailServer/view/EmailServerSettingsInfoView',['module/lib',
        'module/userModules',
        'cmwTemplate!app/settings/emailServer/view/tpl/EmailServerSettingsInfo.html',
        'app/settings/emailServer/view/FormPartView'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("app.settings.emailServer.view");
    var names = window.Context.configurationModel.StaticContext.EmailServerSettingsContext.Names;
    var sharedNs = window.ClassLoader.createNS("shared");

    var fields = [
        'enabled',
        'channelType',
        'linkDomain',
        'testOutgoingTo'
    ];

    viewNs.EmailServerSettingsInfoView = Backbone.Marionette.LayoutView.extend({
        template: 'EmailServerSettingsInfo',
        className: 'one-column-wrp email_server',
        regions: {
            outgoingServer: '#outgoing_server',
            replyServer: '#reply_server'
        },
        events: {
            'click #testOutgoing': 'testOutgoing'
        },
        triggers: {
            'click .button-icon_save': 'emailServerSettings:save'
        },
        behaviors: {
            ContentScrollerBehavior : {
                contentArea: '#emailServerInfo',
                scrollArea: '#viewportContent',
                modelUpdates: ["change:enabled"]
            }
        },
        initialize: function (options) {
            Backbone.Marionette.LayoutView.prototype.initialize.apply(this, arguments);
            _.extend(this, new viewNs.FormPartView({ prefix: 'PROJECT.SETTINGS.EMAILSERVERTAB.'}));
            this.model = options.model;
            this.model.on('change:enabled', this.applyEnabled, this);
            this.model.on('change:channelType', this.applyChannelType, this);
        },
        applyEnabled: function () {
            var v = this.model.get('enabled');
            if (v) {
                this.$replyServer.show();
                this.$outgoingServer.show();
            }
            else {
                this.$replyServer.hide();
                this.$outgoingServer.hide();
            }
        },
        applyChannelType: function () {
            var v = this.model.get('channelType');
            if (v == names.Exchange) {
                this.outgoingServerView = this.exchangeServerView;
            } else {
                this.outgoingServerView = this.smtpServerView;
            }
            this.outgoingServer.show(this.outgoingServerView);
        },
        onRender: function() {
            var self = this;
            self.fieldsEls = {};
            var prefix = 'PROJECT.SETTINGS.EMAILSERVERTAB.';
            self.$replyServer = self.$('#reply_server');
            self.$outgoingServer = self.$('#outgoing_settings');
            self.$processing = self.$('#processing');
            self.$outgoingResult = self.$('#outgoingResult');
            this.buildFieldsElements(fields);
            this.buildField('enabled', js.widget.field.switch.Switch);
            this.buildField('channelType', js.widget.field.select.BSelect, {
                allowBlank: false,
                hasFilter: false,
                items: [{
                        id: names.Exchange,
                        name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANNELTYPE.MSEXCHANGE')
                    }, {
                        id: names.Smtp,
                        name: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANNELTYPE.SMTP')
                    }]
            });
            this.buildField('linkDomain', js.widget.field.text.Text, { allowBlank: false });

            self.exchangeServerView = new viewNs.ExchangeServerSettingsView({ model: self.model });
            self.smtpServerView = new viewNs.SmtpServerSettingsView({ model: self.model });
            self.imapServerSettingsView = new viewNs.ImapServerSettingsView({ model: self.model });
            self.imapServerSettingsView.on('emailServerSettings:testIncoming', this.testIncoming, this);
            self.imapServerSettingsView.on('updateScroller', function(){ self.updateScroller(true)});
            this.buildField('testOutgoingTo', js.widget.field.text.Text, { allowBlank: false, value: "", EmptyText: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.TESTOUTGOINGTO.PLACEHOLDER') }, false);
        },
        testIncoming: function () {
            var self = this;
            window.setTimeout(function() {
                self.$incomingResult = self.$incomingResult || self.$("#incomingResult");
                self.$incomingResult.hide();
                self.trigger('emailServerSettings:testIncoming', function() {
                    self.$incomingResult.show();
                    window.setTimeout(function() { self.$incomingResult.fadeOut(400); }, 3000);
                });
            }, 0);
        },
        testOutgoing: function () {
            var self = this;
            window.setTimeout(function() {
                self.$outgoingResult.hide();
                self.trigger('emailServerSettings:testOutgoing', self.fields['testOutgoingTo'].getValue(), function () {
                    self.$outgoingResult.show();
                    window.setTimeout(function() { self.$outgoingResult.fadeOut(400); }, 3000);
                });
            }, 0);
        },
        onShow: function () {
            this.replyServer.show(this.imapServerSettingsView);
            this.applyChannelType();
            this.applyEnabled();
        },
       
        updateScroller: function () {
            this.trigger('updateScroller');
        },
        showProcessing: function(show) {
            show ? this.$processing.show() : this.$processing.hide();
        },
        markInvalidFields: function(fields) {
            this.imapServerSettingsView.markInvalid(fields);
            this.smtpServerView.markInvalid(fields);
            this.exchangeServerView.markInvalid(fields);
            this.markInvalid(fields);
        }
    });
});
define('app/settings/emailServer/controller/EmailServerSettingsController',['module/shared', 'app/settings/emailServer/model/EmailServerSettings',
    'app/settings/emailServer/view/SmtpServerSettingsView', 'app/settings/emailServer/view/ExchangeServerSettingsView',
    'app/settings/emailServer/view/ImapServerSettingsView', 'app/settings/emailServer/view/EmailServerSettingsInfoView'], function() {
    'use strict';

    var ns = window.ClassLoader.createNS("app.settings.emailServer");
    var controllerNs = window.ClassLoader.createNS("app.settings.emailServer.controller");
    var sharedNs = window.ClassLoader.createNS("shared");

    controllerNs.EmailServerSettingsController = Backbone.Marionette.Controller.extend({
        initialize: function(moduleInstance) {
            this.moduleInstance = moduleInstance;
        },

        onDestroy: function() {
            this.emailServerSettingsView && this.emailServerSettingsView.destroy();
            this.model && this.model.stopTracking();
        },

        //Entry point
        showEmailServerSettings: function() {
            var self = this;
            self.moduleInstance.moduleRegion.show(new sharedNs.view.LoadingView());
            self.moduleInstance.reqres.request('EmailServerSettings:get')
                .then(function(settings) {
                    if (settings) {
                        self.model = new ns.model.EmailServerModel(settings, {
                            parse: true,
                            unsaved: {
                                unloadWindowPrompt: true,
                                unloadRouterPrompt: true,
                                prompt: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANGESDIALOG.PROMPT'),
                                confirm: function(prompt) {
                                    return new Promise(function(resolve, reject) {
                                        var dialog = new window.CDialog(Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANGESDIALOG.TITLE'), '', {
                                            autoOpen: true,
                                            width: 600,
                                            ok: {
                                                text: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANGESDIALOG.LEAVE'),
                                                callback: function () {
                                                    resolve(true);
                                                }
                                            },
                                            cancel: {
                                                text: Localizer.get('PROJECT.SETTINGS.EMAILSERVERTAB.CHANGESDIALOG.STAY'),
                                                callback: function () {
                                                    resolve(false);
                                                }
                                            }
                                        });
                                        dialog.open();
                                    });
                                }
                            }
                        });
                        self.model.startTracking();
                        self.emailServerSettingsView = new ns.view.EmailServerSettingsInfoView({ model: self.model });
                        self.emailServerSettingsView.on('emailServerSettings:save', self.saveSettings, self);
                        self.emailServerSettingsView.on('emailServerSettings:testIncoming', self.testIncoming, self);
                        self.emailServerSettingsView.on('emailServerSettings:testOutgoing', self.testOutgoing, self);
                        self.moduleInstance.moduleRegion.show(self.emailServerSettingsView);
                    }
                });
        },

        saveSettings: function() {
            var self = this;
            var v = self.model.validateModel();
            if (v.length) {
                self.emailServerSettingsView.markInvalidFields(v);
            } else {
                self.emailServerSettingsView.showProcessing(true);
                self.moduleInstance.reqres.request('EmailServerSettings:edit', { model: self.model })
                    .then(function(settings) {
                        self.emailServerSettingsView.showProcessing(false);
                        if (settings) {
                            self.model.set(settings);
                        }
                        self.model && self.model.restartTracking();
                        window.application.navigationController.reload();
                    });
            }
        },

        testIncoming: function(success) {
            var self = this;
            var v = self.model.validateModel();
            if (v.length) {
                self.emailServerSettingsView.markInvalidFields(v);
            } else {
                self.emailServerSettingsView.showProcessing(true);
                self.moduleInstance.reqres.request('EmailServerSettings:testIncoming', { model: self.model })
                    .then(function(res) {
                        self.emailServerSettingsView.showProcessing(false);
                        res && success && success();
                    })
                    .catch(function() {
                        Ajax._dialog.set(Localizer.get('ADMINISTRATION.NAVIGATION.EMAILSETTINGS.INCOMING.TESTCONNECTION.FAIL.TITLE'), Localizer.get('ADMINISTRATION.NAVIGATION.EMAILSETTINGS.INCOMING.TESTCONNECTION.FAIL.DESCRIPTION')).open();
                    });
            }
        },

        testOutgoing: function(to, success) {
            var self = this;
            var v = self.model.validateModel();
            (!to || !$.validator.methods.email.call(self.model, to)) && v.push('testOutgoingTo');
            if (v.length) {
                self.emailServerSettingsView.markInvalidFields(v);
            } else {
                self.emailServerSettingsView.showProcessing(true);
                self.moduleInstance.reqres.request('EmailServerSettings:testOutgoing', { model: self.model, to: to })
                    .then(function(res) {
                        self.emailServerSettingsView.showProcessing(false);
                        res && success && success();
                    });
            }
        }
    });
});
define([
    'app/settings/emailServer/controller/ModelManager',
    'app/settings/emailServer/controller/EmailServerSettingsController'
]);

