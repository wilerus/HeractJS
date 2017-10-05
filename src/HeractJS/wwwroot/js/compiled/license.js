
define('text-loader!app/settings/license/view/tpl/licenseLayout.html',[],function () { return '<div class="one-column-content">\r\n    <ul class="tr-header">\r\n        <li class="right tr-header__item">\r\n            <a href="{{{this.getBuyLink()}}}" class="tr-header__link" target="_blank">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.MANAGESUBSCRIPTION\')}}}</a>\r\n        </li>\r\n        <li class="tr-header__item" title="">\r\n            <h1 class="h1-header">\r\n                {{if isSaas}}\r\n                    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.SUBSCRIPTION\')}}}\r\n                {{else}}\r\n                    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSING\')}}}\r\n                {{/if}}\r\n            </h1>\r\n        </li>\r\n    </ul>\r\n\r\n    <div id="listLicenses"></div>\r\n    <div></div>\r\n    <div></div>\r\n    <div id="newLicenses" class="license-info"></div>\r\n</div>';});



define('text-loader!app/settings/license/view/tpl/licenseList.html',[],function () { return '<thead>\r\n    <tr>\r\n        <td class="license-tbl__th">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.PRODUCTS\')}}}</td>\r\n        <td class="license-tbl__th">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.TYPE\')}}}</td>\r\n        <td class="license-tbl__th">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.SEATS\')}}}</td>\r\n        <td class="license-tbl__th">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.SEATSLEFT\')}}}</td>\r\n        <td class="license-tbl__th">{{{isSaas ? this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.SUBSCRIPTION\') : this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.EXPIRES\')}}}</td>\r\n    </tr>\r\n</thead>\r\n<tfoot id="licenseComment">\r\n    <tr>\r\n        <td colspan="5" class="license-tbl__tf">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.COMINDWAREPROJECT.DESCRIPTION\')}}}</td>\r\n    </tr>\r\n     <tr>\r\n        <td colspan="5" class="license-tbl__tf">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.LICENSELIST.COMINDWARETEAMNETWORK.DESCRIPTION\')}}}</td>\r\n    </tr>\r\n</tfoot>\r\n<tbody id="licensesCollection"></tbody>';});



define('text-loader!app/settings/license/view/tpl/licenseItem.html',[],function () { return '<td name="productName" class="license-tbl__td">{{productName}}</td>\r\n<td name="licenseType" class="license-tbl__td">{{type}}</td>\r\n<td name="licenseCount" class="license-tbl__td">\r\n    {{if unlimited}}\r\n        {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.UNLIMITED\')}}}\r\n    {{else}}\r\n        {{licenseCount}}\r\n    {{/if}}\r\n</td>\r\n<td name="licenseLeftCount" class="license-tbl__td">\r\n    {{if unlimited}} \r\n        <b class="license-tbl__unlim">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.UNLIMITED\')}}}</b>\r\n    {{else}}\r\n        {{licensesLeftCount}}\r\n    {{/if}}\r\n</td>\r\n<td name="licenseExpiration" class="license-tbl__td{{isExpired ? \' license-tbl__td_date\' : \'\'}}">\r\n    {{if neverExpire}}\r\n        {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.NEVER\')}}}&nbsp;\r\n    {{else}}\r\n        {{subscriptionEndsPresentation}}&nbsp;\r\n        {{if !isExpired}}\r\n             ({{{Localizer.getPluralForm(daysLeft, this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.DAYSLEFT\')).replace(\'{0}\', daysLeft)}}})\r\n        {{/if}}\r\n    {{/if}}\r\n</td>\r\n';});



define('text-loader!app/settings/license/view/tpl/licenseAddingNew.html',[],function () { return '<div id="checkingNewLicenses" class="js-licensing-addingNewState">\r\n     {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.ADDINGNEW.CHECKFORAVAILABLE\')}}}\r\n</div>\r\n\r\n<div id="haveNoNewLicenses" class="js-licensing-addingNewState" style="display: none">\r\n    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.ADDINGNEW.NONEWLICENSES\')}}}\r\n</div>\r\n\r\n<div id="cantConnectToLicense" class="js-licensing-addingNewState"  style="display: none">\r\n    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.ADDINGNEW.CANTCONNECT.MESSAGE\')}}}&nbsp;\r\n    <a href="javascript:void(0)" id="addManualLink">{{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.ADDINGNEW.CANTCONNECT.SUGGEST\')}}}</a>\r\n    <div id="manualActivation"></div>\r\n</div>\r\n\r\n<div id="newLicensesAddedSuccessfully"  class="js-licensing-addingNewState" style="display: none">\r\n    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.ADDINGNEW.ADDEDSUCCESSFULLY\')}}}\r\n</div>\r\n\r\n<div id="newLicensesError" class="js-licensing-addingNewState" style="display: none">\r\n   {{errorText}}\r\n</div>\r\n\r\n\r\n';});



define('text-loader!app/settings/license/view/tpl/licenseManualActivation.html',[],function () { return '<div>\r\n    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.MANUALACTIVATION.GENERATEACTIVATIONREQUESTFILETEXT\')}}} <a href="http://comindware.com/my-account">www.comindware.com/my-account</a>.\r\n    <iframe style="display:none" name="serialsFrame" id="serialsFrame" src="about:blank"></iframe>\r\n    <form id="serialsForm" method="post" action="/api/CreateActivationFile" target="serialsFrame">\r\n        <textarea id="serials" class="cmw-textarea" name="serials" style="width: 100%; height: 56px; margin: 15px 0;"></textarea>\r\n    </form>\r\n    <a href="javascript:void(0)" id="generateActiveationRequestFile">\r\n        {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.MANUALACTIVATION.GENERATEACTIVATIONREQUESTFILEBTN\')}}}\r\n    </a>\r\n</div>\r\n<div>\r\n    {{{this.Localizer(\'PROJECT.SETTINGS.LICENSESTAB.MANUALACTIVATION.LOADACTIVATIONRESPONSEFILETEXT\')}}}\r\n    <div id="loadActivationResponseFile"></div>\r\n</div>';});


define('app/settings/license/model/LicenseCollection',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var modelNs = window.ClassLoader.createNS("settings.license.model");
    
    modelNs.LicenseCollectionItem = Backbone.Model.extend({
        dateFormatter: js.util.Calendar.dateFormatter('{Y}-{m}-{d}T00:00:00'),
        initialize: function () {
        	Backbone.Select.Me.applyTo(this);
            this.computedFields = new Backbone.ComputedFields(this);
        },

        defaults: {
            productName: '',
            licenseCount: 0,
            activeUsersCount: 0,
            licensesLeftCount: 0,
            unlimited: false,
            isSaas: window.Context.configurationModel.Info.IsSaas,
            daysLeft: 0,
            neverExpire: false,
            subscriptionEnds: null
        },

        computed: {
            subscriptionEndsPresentation: {
                depends: ['subscriptionEnds'],
                get: function () {
                    return js.util.Renderers.serverDatePresentation(js.util.Renderers.renderers.dateWithYear,
                                                                    this.get('subscriptionEnds'));
                }
            },
            isExpired: {
                depends: ['daysLeft'],
                get: function () {
                    return !this.get('neverExpire') && this.get('daysLeft') < 1;
                }
            }
        }
    });
    
    modelNs.LicenseCollection = Backbone.Collection.extend({
        model: modelNs.LicenseCollectionItem,
        url: 'Settings/LicensiesList',

        initialize: function (models) {
        	Backbone.Select.One.applyTo(this, models);
        },

        parse: function (response, options) {
            return response.data;
        }
    });
});

define('app/settings/license/model/LicenseAddingNewModel',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var modelNs = window.ClassLoader.createNS("settings.license.model");
    var sharedModelNs = window.ClassLoader.createNS("license.model");

    modelNs.NewLicensesState = {
        CheckingNew: 'checkingNewLicenses',
        HaveNoNew: 'haveNoNewLicenses',
        CantConnect: 'cantConnectToLicense',
        AddedSuccessfully: 'newLicensesAddedSuccessfully'
    };

    modelNs.LicenseAddingNewModel = Backbone.Model.extend({
        urlRoot: 'Settings/GetLicenseChanges',
        initialize: function() {

        },

        defaults: {
            state: modelNs.NewLicensesState.CheckingNew,
            hasConnection: false,
            newLicensesCount: 0,
            errorText: '',
            serials: ''
        },

        parse: function (response, options) {
            var data = {};
            data.hasConnection = response.data.ActivationConnectionAvailable;
            data.newLicensesCount = response.data.NewLicensesCount;
            if (data.hasConnection == true) {
                if (data.newLicensesCount > 0) {
                    data.state = modelNs.NewLicensesState.AddedSuccessfully;
                } else {
                    data.state = modelNs.NewLicensesState.HaveNoNew;
                }
            } else {
                data.state = modelNs.NewLicensesState.CantConnect;
            }
            return data;
        },
        
        setError: function (ajaxResultOrText) {
            if (typeof ajaxResultOrText === "object") {
                var errorText = Ajax._getErrorText(ajaxResultOrText);
                errorText = errorText.replace('{0}', ajaxResultOrText.extraData);
                this.set({ 'errorText': errorText });
            } else if (typeof ajaxResultOrText === "string") {
                this.set({ 'errorText': ajaxResultOrText });
            }
        }
    });
});

define('app/settings/license/view/LicenseListView',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("settings.license.view");
    var sharedViewNs = window.ClassLoader.createNS("shared.view");
    

    viewNs.LicenseListItemView = Backbone.Marionette.ItemView.extend({
        className: 'license-tbl__tr',
        tagName: 'tr',
        template: 'licenseItem'
    });
    
    viewNs.LicenseListView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        className: 'license-tbl',
        template: 'licenseList',
        childView: viewNs.LicenseListItemView,
        childViewContainer: "#licensesCollection",

        onRender: function () {

            var unlimited =  this.collection.findWhere({ 'unlimited': true });
            if (unlimited)
                this.$el.find('#licenseComment').show();
            else
                this.$el.find('#licenseComment').hide();
        }
    });
});

define('app/settings/license/view/LicenseAddingNewView',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("settings.license.view"),
        modelNs = window.ClassLoader.createNS("settings.license.model");

    viewNs.LicenseAddingNewView = Backbone.Marionette.LayoutView.extend({
        template: 'licenseAddingNew',
        stateClass: 'js-licensing-addingNewState',
        events: {
            'click #addManualLink': 'onAddManualClick'
        },
        modelEvents: {
            'change:state': 'onChangeState',
            'change:errorText': 'showError'
        },
        regions: {
            manualActivation: '#manualActivation'
        },

        manualActivationView: null,

        onChangeState: function () {
            this.render();
        },

        onAddManualClick: function () {
            var _self = this;
            this.trigger('manualActivation');
            this.manualActivationView = new viewNs.LicenseManualActivationView({model: this.model});
            this.manualActivationView.on('generateActiveationRequestFile', function ($form) {
                _self.trigger('manualActivation:generateActiveationRequestFile', $form);
            });
            this.manualActivationView.on('loadActivationResponseFile', function (iframe, form, input, sid) {
                _self.trigger('manualActivation:loadActivationResponseFile', iframe, form, input, sid);
            });
            this.manualActivation.show(this.manualActivationView);
        },

        showError: function () {
            this.$el.find('#' + modelNs.NewLicensesState.AddedSuccessfully).hide();
            this.$el.find('#newLicensesError').html(this.model.get('errorText')).show();
        },
        hideError: function () {
            this.$el.find('#newLicensesError').hide();
        },
        
        onRender: function () {
            this.$el.find('.' + this.stateClass).hide();
            this.$el.find('#' + this.model.get('state')).show();
        }
        
    });
});

define('app/settings/license/view/LicenseManualActivationView',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var viewNs = window.ClassLoader.createNS("settings.license.view");

    viewNs.LicenseManualActivationView = Backbone.Marionette.LayoutView.extend({
        template: 'licenseManualActivation',
        loadResponseWidget: null,

        events: {
            'click #generateActiveationRequestFile': 'onGenerateActivationRequestFileClick'
        },

        onGenerateActivationRequestFileClick: function() {
            this.trigger('generateActiveationRequestFile', this.$el.find('#serialsForm'));
        },

        onRender: function () {
            var _self = this;
            this.loadResponseWidget = js.widget.field.attachment.Attachment({
                tpl: 'loadActivationFile',
                renderTo: this.$el.find('#loadActivationResponseFile')[0],
                uploadUrl: '/api/LoadActivations',
                onUploadedFile: function (iframe, form, input, sid) {
                    _self.trigger('loadActivationResponseFile', iframe, form, input, sid);
                    this.refresh();
                }
            });
        }
    });
});

define('app/settings/license/view/Layout',['cmwTemplate!app/settings/license/view/tpl/licenseLayout.html', 'module/shared',
    'module/shared',
    'module/lib',
    'module/userModules'], function (licenseLayoutTemplate) {
    'use strict';
    var view = window.ClassLoader.createNS("settings.license.view");
    licenseLayoutTemplate.logicTpl.getBuyLink = function () {
        var licensingUrl = encodeURIComponent(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + "//#Settings//License//");
        var replaceTo = "url=" + licensingUrl + "&email=" + Context.configurationModel.Info.ActivatedBy + "&interest=" + (Context.configurationModel.Info.IsSaas ? "saas" : "onpremise");

        var link = Localizer.get('PROJECT.SETTINGS.LICENSESTAB.BUYLINK').replace("{0}", replaceTo);
        return link;
    };

    view.Layout = Backbone.Marionette.LayoutView.extend({
        className: 'one-column-wrp one-column-wrp_notoolbar',
        template: 'licenseLayout',
        regions: {
            list: '#listLicenses',
            newLicenses: '#newLicenses'
        },
        onShow: function () {
            this.resizer = js.ui.Resizer();
        }
    });
});
define('app/settings/license/controller/LicenseActivationController',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var controllerNs = window.ClassLoader.createNS("settings.license.controller"),
        modelNs = window.ClassLoader.createNS("settings.license.model"),
        viewNs = window.ClassLoader.createNS("settings.license.view"),
        sharedNs = window.ClassLoader.createNS("shared");

    controllerNs.LicenseActivationController = Backbone.Marionette.Controller.extend({
        moduleInstance: null,
        newLicensesModel: null,
        newLicensesView: null,
        region: null,

        initialize: function (cfg) {
            _.extend(this, cfg);
            this.newLicensesModel = new modelNs.LicenseAddingNewModel();
            this.newLicensesView = new viewNs.LicenseAddingNewView({
                model: this.newLicensesModel
            });
            this.region.show(this.newLicensesView);
            $.when(this._fetchNewLicenses()).done(function (data) {
                
            });

            this.newLicensesModel.on("change:state", function (changedModel, newValue) {
                if (newValue == modelNs.NewLicensesState.AddedSuccessfully) {
                    this.moduleInstance.eventAggregator.trigger('afterAddNewLicenses');
                }
            }, this);
            
            this.newLicensesView.on('manualActivation:generateActiveationRequestFile', this._generateActivationRequestFile, this);
            this.newLicensesView.on('manualActivation:loadActivationResponseFile', this._loadActivationResponseFile, this);
        },
        
        _fetchNewLicenses: function () {
            var defer = $.Deferred();
            this.newLicensesModel.fetch({
                success: function (data) {
                    defer.resolve(data);
                },
                error: function (data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        },
        
        _generateActivationRequestFile: function ($form) {
            var textareaVal = $form.find('textarea').val();
            if (!textareaVal || textareaVal == '') {
                this.newLicensesModel.setError(this.Localizer('PROJECT.SETTINGS.LICENSESTAB.MANUALACTIVATION.ERRSERIALNUMBERISEMPTY'));
                return;
            }
            var _self = this;
            window.scriptInj = function (result) {
                if (result.success === false) {
                    _self.newLicensesModel.setError(result);
                }
            };
            $form[0].submit();
        },
        
        _loadActivationResponseFile: function (iframe, form, input, sid) {
            var doc = (iframe.contentDocument && iframe.contentWindow.document) || iframe.contentDocument || (window.frames[sid] && window.frames[sid].document);
            if (!doc) return; 

            var res = doc.body.innerHTML;
            if (!res) return; 
            eval('window.tmp_res1 = res=' + res + ';'); //compiled version eval bug in add documents
            var result = window["tmp_res1"];
            if (result.success === false) {
                this.newLicensesModel.setError(result);
            } else {
                this.newLicensesModel.set({ 'state': modelNs.NewLicensesState.AddedSuccessfully });
            }
            delete window["tmp_res1"];
            input.val('');
            document.body.removeChild(form);
            document.body.removeChild(iframe);
        }
    });
});
define('app/settings/license/controller/LicenseController',['module/shared',

    'module/lib',
    'module/userModules'], function () {
    'use strict';

    var controllerNs = window.ClassLoader.createNS("settings.license.controller"),
        modelNs = window.ClassLoader.createNS("settings.license.model"),
        viewNs = window.ClassLoader.createNS("settings.license.view"),
        sharedNs = window.ClassLoader.createNS("shared");
    
    controllerNs.LicenseController = Backbone.Marionette.Controller.extend({
        
        mainLayout: null,
        moduleInstance: null,
        
        listView: null,
        newLicensesView: null,
        
        licenseActivationController: null,
        
        initialize: function(moduleInstance) {
            this.moduleInstance = moduleInstance;
            this.moduleInstance.eventAggregator = new Backbone.Wreqr.EventAggregator();
        },
        
        showLayout: function () {
            if (!this.mainLayout) {
                this._initLayout();
            }
        },

        _initLayout: function () {
            this.mainLayout = new viewNs.Layout({
                model: new Backbone.Model({
                    isSaas: window.Context.configurationModel.Info.IsSaas
                })
            });
            this.mainLayout.on("render", this._showList, this);
            this.moduleInstance.moduleRegion.show(this.mainLayout);
        },

        _showList: function () {
            var _self = this;
            if (!this.listView) {
                this.mainLayout.list.show(new sharedNs.view.LoadingView());
            }
            $.when( this._fetchAllLicensies()).done(function (licenseCollection) {
                _self._initListView(licenseCollection);
            });
        },
        
        _initListView: function (collection) {
            var _self = this;
            this.listView = new viewNs.LicenseListView({
                collection: collection,
                model: new Backbone.Model({
                    isSaas: window.Context.configurationModel.Info.IsSaas
                })
            });
            _self.mainLayout.list.show(_self.listView);

            if (!collection.findWhere({ unlimited: true }) || !window.Context.configurationModel.Info.IsSaas) {
                this._initAddNewLicensesView();
            }
        },
        
        _initAddNewLicensesView: function () {
            var _self = this;
            if (!this.licenseActivationController) {
                this.licenseActivationController = new controllerNs.LicenseActivationController({
                    region: this.mainLayout.newLicenses,
                    moduleInstance: this.moduleInstance
                });
                this.moduleInstance.eventAggregator.on('afterAddNewLicenses', function() {
                    _self._showList();
                });
            }
        },
        
        
        _fetchAllLicensies: function () {
            var defer = $.Deferred();
            var licenseCollection = new modelNs.LicenseCollection();
            licenseCollection.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        }
       
    });
});

define([
    //
    //'module/shared',
    //'module/userModules',
    //'module/backboneplugins',

    'cmwTemplate!app/settings/license/view/tpl/licenseLayout.html',
    'cmwTemplate!app/settings/license/view/tpl/licenseList.html',
    'cmwTemplate!app/settings/license/view/tpl/licenseItem.html',
    'cmwTemplate!app/settings/license/view/tpl/licenseAddingNew.html',
    'cmwTemplate!app/settings/license/view/tpl/licenseManualActivation.html',
    'app/settings/license/model/LicenseCollection',
    'app/settings/license/model/LicenseAddingNewModel',
    'app/settings/license/view/LicenseListView',
    'app/settings/license/view/LicenseAddingNewView',
    'app/settings/license/view/LicenseManualActivationView',
    'app/settings/license/view/Layout',
    'app/settings/license/controller/LicenseActivationController',
    'app/settings/license/controller/LicenseController'
]);

