
define('text-loader!app/globalSearch/view/tpl/layout.html',[],function () { return '<!--<div class="button-icon button-icon_close" id="btnCloseGlobalSearch" style="float: right"></div>-->\r\n<div class="global-mask" id="global-mask"></div>\r\n<div></div>\r\n<div id="gs-resizer" class="resizer"></div>\r\n<div class="gs-wrp">\r\n    <div id="mentionsInput"></div>\r\n    <div id="bntGlobalSearch" class="gs-button" style="display: none;"></div>\r\n    <ul class="gs-option">\r\n        <li class="gs-option__item gs-option__item_last"><div id="searchTimeFilter" class="tr-sort"><span>{{{this.Localizer(\'PROJECT.GLOBALSEARCH.SEARCH.PERIOD.ALLTIME\')}}}</span></div></li>\r\n        <li class="gs-option__item">{{{this.Localizer(\'PROJECT.GLOBALSEARCH.SEARCH\')}}}</li>\r\n        <li class="gs-option__item"><div id="searchInComments" class="gs-option__checkbox"></div>{{{this.Localizer(\'PROJECT.GLOBALSEARCH.SEARCH.INCOMMENTS\')}}}</li>\r\n        <li class="gs-option__item"><div id="searchInDocumentContent" class="gs-option__checkbox"></div>{{{this.Localizer(\'PROJECT.GLOBALSEARCH.SEARCH.INDOCCONTENT\')}}}</li>\r\n    </ul>\r\n    <div id="searchTabContainer" class="tr-filters tr-filters_gs"></div>\r\n    <div id="searchResults" style="height: auto; color:black; "></div>\r\n</div>\r\n';});



define('text-loader!app/globalSearch/view/tpl/emptySearchResults.html',[],function () { return '<div class="emptySearchResults">{{{this.Localizer(\'PROJECT.GLOBALSEARCH.NOTHINGFOUND\')}}}</div>';});


define('app/globalSearch/model/SettingsModel',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    'use strict';
    var modelNs = window.ClassLoader.createNS("globalSearch.model");
    modelNs.PERIODS = {
        ALLTIME: "allTime",
        PASTDAY: "pastDay",
        PASTWEEK: "pastWeek",
        PASTMONTH: "pastMonth",
        PASTYEAR: "pastYear"
    };
    modelNs.FILTERS = {
        ALL: "all",
        TASKS: "cmw.UserTask",
        DOCUMENTS: "cmw.document.Document",
        CONVERSATIONS: "cmw.conversation.Conversation"
    };
    
    modelNs.SettingsModel = Backbone.Model.extend({
        streamResults: null,
        defaults: function () {
            return {
                mentions: [],
                text: "",
                inComment: false,
                inDocumentContent: false,
                period: modelNs.PERIODS.ALLTIME,
                tab: null
            };
        }
    });
});
define('app/globalSearch/view/LayoutView',['module/shared',
    'module/lib',
    'module/userModules',
    'project/module/projectactivity'], function () {
    'use strict';
    var viewNs = window.ClassLoader.createNS("globalSearch.view");
    var modelNs = window.ClassLoader.createNS("globalSearch.model");
    viewNs.LayoutView = Backbone.View.extend({
        className: "gs-wraper",
        id: "globalSearch",

       mentionInput: null,
       searchInCommentsCheckBox: null,
       searchInDocumentContentCheckBox: null,
       searchResultsView: null,
       tabsView: null,
       timeFilter: null,
       resizer: null,
        
       $masks: null,
       $targetButton: null,
        
       template: 'layout',
       events: {
           "click #btnCloseGlobalSearch": "hide",
           "click #global-mask": "hide",
           "click #bntGlobalSearch": "onBntGlobalSearchClick",
           "click a": "hide"
       },
       initialize: function (cfg) {
           _.extend(this, cfg);
           this.model.on('change:text', this.doSearch.bind(this));
           this.model.on('change:mentions', this.showBntSearch.bind(this));
       },
       initializeControls: function() {
           var _self = this;
           this.initMentionInput();
           this.searchInCommentsCheckBox = js.widget.field.switch.Switch({
               renderTo: this.$el.find('#searchInComments')[0]
           });
           this.searchInCommentsCheckBox.on('change', function() {
               _self.model.set({ inComment: _self.searchInCommentsCheckBox.getValue() });
               _self.showBntSearch();
           });
           this.searchInDocumentContentCheckBox = js.widget.field.switch.Switch({
               renderTo: this.$el.find('#searchInDocumentContent')[0]
           });
           this.searchInDocumentContentCheckBox.on('change', function () {
               _self.model.set({ inDocumentContent: _self.searchInDocumentContentCheckBox.getValue() });
           });
           this.initTimeFilter();
           this.searchResultsView = app.globalSearch.ActivityStreamInitializer({
               renderTo: this.$el.find('#searchResults')[0],
               tabRenderTo: this.$el.find('#searchTabContainer')[0],
               settings: this.model,
               emptyResults: this.$el.find('#searchIsEmpty')[0]
           });

           this.resizer = js.ui.Resizer({
               selector: '#gs-resizer'
           });
           this.$masks.click(function () {
               _self.hide();
           });

           return this;

       },
       initMentionInput: function() {
           var _self = this;
           this.mentionInput = js.widget.field.mention.Mention({
               renderTo: this.$el.find('#mentionsInput')[0]
           });
           this.mentionInput.on('textareaSubmit', function () {
               _self.model.set({
                   text: _self.mentionInput.getTextNoMention()
               });
           });
           this.mentionInput.on('mentionsChanged', function () {
                _self.model.set({
                   mentions: _.clone(_self.mentionInput.getMentions())
               });
           });
           this.mentionInput.on('cleared', function () {
               _self.model.set({
                   text: "",
                   mentions: []
               });
           });
       },
       initTimeFilter: function() {
           var _self = this,
               $target = this.$el.find('#searchTimeFilter'),
               menuHandler = function (item) {
                   _self.model.set({ period: item.id });
                   $target.children('span').html(item.text);
               },
               menuItems = [{ id: modelNs.PERIODS.ALLTIME, text: Localizer.get('PROJECT.GLOBALSEARCH.SEARCH.PERIOD.ALLTIME'), handler: menuHandler },
                   { id: modelNs.PERIODS.PASTDAY, text: Localizer.get('PROJECT.GLOBALSEARCH.SEARCH.PERIOD.PAST24'), handler: menuHandler },
                   { id: modelNs.PERIODS.PASTWEEK, text: Localizer.get('PROJECT.GLOBALSEARCH.SEARCH.PERIOD.PASTWEEK'), handler: menuHandler },
                   { id: modelNs.PERIODS.PASTMONTH, text: Localizer.get('PROJECT.GLOBALSEARCH.SEARCH.PERIOD.PASTMONTH'), handler: menuHandler },
                   { id: modelNs.PERIODS.PASTYEAR, text: Localizer.get('PROJECT.GLOBALSEARCH.SEARCH.PERIOD.PASTYEAR'), handler: menuHandler }];
           this.timeFilter = js.widget.menu.Menu({
               items: menuItems,
               attachTo: $target[0]
           });
       },
       render: function() {
           this.$el.html(TM.get(this.template).text);
           return this;
       },
       hide: function () {
           this.$el.hide();
           this.$targetButton.removeClass('top-nav__item_selected');
           this.$masks.hide();
       },
       show: function () {
           this.$el.show();
           this.$targetButton.addClass('top-nav__item_selected') ;
           this.$masks.show();
       },
       toggle: function () {
           if (this.$el.css('display') == 'none')
               this.show();
           else
               this.hide();
       },
       doSearch: function () {
           this.mentionInput.hideBntGlobalSearch();
           this.searchResultsView.doSearch(this.model);
       },
       onBntGlobalSearchClick: function () {
           this.model.set({
               text: this.mentionInput.getValue(),
               mentions: _.clone(this.mentionInput.getMentions())
           });
           this.doSearch();
       },
       showBntSearch: function() {
           this.mentionInput.showBntGlobalSearch();
       }
    });
});
/**
 * app.globalSearch.view.StreamView - common view for using in Grid controller
 * StreamView - backbone view with StreamItemView inside
 * copied from app.mywork.activity.view.StreamView to make globalSearch activity
 */
define('app/globalSearch/view/StreamView',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    'use strict';
    var nsActivity = window.ClassLoader.createNS("app.mywork.activity");
    
    ClassLoader.define('app.globalSearch.view.StreamView', {
        ctor: function (cfg) {
            _.extend(this, cfg);

            if (this.renderTo && this.collection) {
                this.renderTo.appendChild($(TM.getF("emptySearchResults")().text)[0]);
                this.view = new nsActivity.view.SubjectsCollectionView({
                    collection: this.collection
                });
                this.view.$el.appendTo(this.renderTo);
                this.renderTo.appendChild($(TM.getF("LoadingFetchMoreStream")().text)[0]);
            }
        }
    });
});
define('app/globalSearch/controller/Activity',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    var _ = window._;
    var Ajax = window.Ajax;
    var js = window.js;
    var JS = window.JS;
    var app = window.app = window.app || {};
    var modelNs = window.ClassLoader.createNS("globalSearch.model"),
        sharedView = window.ClassLoader.createNS("shared.view");
    
    window.ClassLoader.define('app.globalSearch.controller.Activity', {
        dispatcher: null,
        router: null,
        timerFetchMore: null,
        haveNoResults: true,
        $emptyStreamView: null,
        $loading: null,
        $scrollerRenderTo: null,
        
        ctor: function (cfg) {
            _.extend(this, cfg);
            this.loadStreamView();
            this.dispatcher.bind("ActionFinished", function (actionName) {
                var fnName = actionName + "Finished";
                if (typeof this.Actions[fnName] == "function") {
                    this.Actions[fnName].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }.bind(this));
            for (var eventName in this.listeners) {
                this.dispatcher.bind(eventName, this.listeners[eventName].bind(this));
            }
        },

        loadStreamView: function () {
            var _self = this;
            this.StreamView = app.globalSearch.view.StreamView({
                collection: this.StreamController.collection,
                renderTo: this.renderTo,
                dispatcher: this.dispatcher,
                OperationManager: this.OperationManager
            });
            this.scroller = new sharedView.behaviors.ContentScroller({
                $contentArea: $('#searchResults'),
                wrapContent: true
            });
            this.scrollerUpdate = function () {
                _.defer(function () {
                    _self.scroller.update(true);
                    _self.triggerLoadFetchMore();
                });
            };
            this.$emptyStreamView = $(this.renderTo).find(".emptySearchResults");
            this.$emptyStreamView.hide();
            this.$loading = $(this.renderTo).find(".LoadingFetchMoreSubject").hide();
            this.scroller.on("demand", this.triggerLoadFetchMore.bind(this));

            this.StreamController.collection.bind("add", function (item) {
                _self.scrollerUpdate();
                item.InnerItems && item.InnerItems.on("add", _self.scrollerUpdate);
            });
        },
    
        loadTabView: function () {
            this.tabsView = js.widget.toolbar.TabContainer({
                renderTo: this.filtersRenderTo,
                items: [{ id: modelNs.FILTERS.ALL, name: Localizer.get('PROJECT.GLOBALSEARCH.TABS.ALL') },
                    { id: modelNs.FILTERS.TASKS, name: Localizer.get('PROJECT.GLOBALSEARCH.TABS.TASKS') },
                    { id: modelNs.FILTERS.DOCUMENTS, name: Localizer.get('PROJECT.GLOBALSEARCH.TABS.DOCUMENTS') },
                    { id: modelNs.FILTERS.CONVERSATIONS, name: Localizer.get('PROJECT.GLOBALSEARCH.TABS.CONVERSATINS') }]
            });
            this.tabsView.on(modelNs.FILTERS.ALL, this.showTab.bind(this));
            this.tabsView.on(modelNs.FILTERS.TASKS, this.showTab.bind(this));
            this.tabsView.on(modelNs.FILTERS.DOCUMENTS, this.showTab.bind(this));
            this.tabsView.on(modelNs.FILTERS.CONVERSATIONS, this.showTab.bind(this));
            this.tabsView.select(modelNs.FILTERS.ALL, null ,true);
        },
        
        refreshTabView: function (visibledTabs) {
            if (!this.tabsView)
                this.loadTabView();

            if (!visibledTabs || !visibledTabs.length)
                $(this.tabsView.renderTo).hide();
            else
                $(this.tabsView.renderTo).show();

            //hide empty tabs
            _.each(this.tabsView.items, function (tab) {
                if (_.indexOf(visibledTabs, tab.id) != -1 || tab.id == modelNs.FILTERS.ALL) {
                    tab.hidden = false;
                } else {
                    tab.hidden = true;
                }
            });
            this.tabsView.refresh();
        },
        
        showTab: function () {
            this.StreamController.collection.reset();
            this.OperationManager.ResetStream();
            
            var currentTab = this.tabsView.getSelectedId();
            if (currentTab === modelNs.FILTERS.ALL)
                this.OperationManager.settingsModel.set({ tab: null });
            else 
                this.OperationManager.settingsModel.set({ tab: currentTab });
            
            this.revertLoading();
            this.triggerLoad();
        },
       
        triggerLoad: function () {
            this.OperationManager.GlobalSearch();
            this.$loading.show();
        },
        
        triggerLoadFetchMore: function () {
            if (this.$loading && !this.$loading.is(":visible") && !this.haveNoResults) {
                this.OperationManager.GlobalSearchFetchMore();
                this.$loading.show();
            }
        },
        
        doSearch: function (model) {
            if (model.get('text') === null || model.get('text') === "") {
                this.haveNoResults = true;
                this.clearSearchResults();
                //this.$emptyStreamView.show();
            } else {
                this.noSearchState = false;
                this.OperationManager.settingsModel = model;
                this.triggerLoad();
                //this.$emptyStreamView.hide();
            }
        },
        
        clearSearchResults: function () {
            this.StreamController.collection.reset();
            this.OperationManager.ResetStream();
            this.refreshTabView();
            this.scroller.reset();
        },
        
        hideLoading: function () {
            this.$loading && this.$loading.hide();
            this.$emptyStreamView.hide();
        },

        revertLoading: function () {
            this.$loading = this.$loading || this._$loading;
        },
        
       Actions: {
            GlobalSearchFetchMoreFinished: function (res) {
                this.haveNoResults = false;
                this.hideLoading();
                
                if (!res.result.items.length) {
                    this.haveNoResults = true;
                }
            },
            
            GlobalSearchFinished: function (res) {
                this.haveNoResults = false;
                this.hideLoading();
                
                if (!res.result.items.length) {
                    this.$emptyStreamView.show();
                    this.haveNoResults = true;
                }
                else
                    this.$emptyStreamView.hide();
                this.refreshTabView(res.result.tabs);
            }
        }
    });
});

define('app/globalSearch/controller/StreamController',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    var base = 'app.mywork.activity.controller.StreamController',
        activitySubject = shared.services.CacheService;
    
    ClassLoader.define('app.globalSearch.controller.StreamController', {
        ctor: function(cfg) {
            var prototypeActions = ClassLoader.classManager[base].prototype.Actions;
            this.Actions = _.extend(_.clone(prototypeActions), this.Actions);

            this.$call(base, 'ctor')(cfg);
        },

        Actions: {
            GlobalSearchFinished: function (res) {
                this.collection.reset();
                activitySubject.UpdateCache(res.subjectsAndDocuments.referenced);
                this.collection.addSubjects(res.subjectsAndDocuments.activitySubjects);
            },
            GlobalSearchFetchMoreFinished: function (res) {
                activitySubject.UpdateCache(res.subjectsAndDocuments.referenced);
                this.collection.addSubjects(res.subjectsAndDocuments.activitySubjects);
            }
        }
    }, base);
});

define('app/globalSearch/utils/OperationManager',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    var base = 'app.mywork.activity.utils.OperationManager';
    ClassLoader.define('app.globalSearch.utils.OperationManager', {
        settingsModel: null,

        ctor: function(cfg) {
            var prototypeActions = ClassLoader.classManager[base].prototype.Actions;
            this.Actions = _.extend(_.clone(prototypeActions), this.Actions);

            this.$call(base, 'ctor')(cfg);
        },

        Actions: {
            GlobalSearch: function(callback) {
                var _self = this,
                    settings = this.settingsModel.toJSON();

                Ajax.GlobalSearch.DoSearch(settings, this._streamId, function(res) {
                    _self.StreamResultCallback(res, callback);
                });
            },
            GlobalSearchFetchMore: function(callback) {
                var _self = this;
                Ajax.GlobalSearch.DoSearchFetchMore(this._streamId, function(res) {
                    _self.StreamResultCallback(res, callback);
                });
            }
        }
    }, base);
});

define('app/globalSearch/ActivityStreamInitializer',['module/shared',
    'module/lib',
    'module/userModules',

    'project/module/projectactivity'], function () {
    'use strict';
    var nsActivity = window.ClassLoader.createNS("app.mywork.activity");

    ClassLoader.define('app.globalSearch.ActivityStreamInitializer', {
        renderTo: null,
        tabRenderTo: null,
        emptyResults: null,

        ctor: function (cfg) {
            _.extend(this, cfg);
            var _self = this;

            this.dispatcher = _.clone(Backbone.Events);
            this.operationManager = app.globalSearch.utils.OperationManager({
                dispatcher: this.dispatcher
            });

            shared.services.CacheService.onReady(function () {
                _self.initStreamController(_self);
                _self.initActivity(_self);
            });
        },

        initActivity: function (context) {
            context.grid = this.grid = app.globalSearch.controller.Activity({
                dispatcher: context.dispatcher,
                renderTo: context.renderTo,
                filtersRenderTo: context.tabRenderTo,
                StreamController: context.StreamController,
                OperationManager: context.operationManager,
                $scrollerRenderTo: $(context.renderTo).parent()
            });
        },

        initStreamController: function (context) {
            context.StreamController = this.StreamController = app.globalSearch.controller.StreamController({
                dispatcher: context.dispatcher,
                utils: shared.services.CacheService
            });
        },

        doSearch: function (model) {
            this.grid.doSearch(model);
        }
    });
});

define('app/globalSearch/Initializer',['module/shared',
    'module/lib',
    'module/userModules',
    'project/module/projectactivity'], function () {
    'use strict';
    //window.classes = {};
    var JS = window.JS, TM = window.TM, js = window.js;
    var viewNs = window.ClassLoader.createNS("globalSearch.view"),
        modelNs = window.ClassLoader.createNS("globalSearch.model");
    window.ClassLoader.define('app.globalSearch.Initializer', {
        implement: ['js.util.Observable'],

        $renderTo: null,
        layout: null,
        settings: null,
        
        ctor: function (cfg) {
            _.extend(this, cfg);
            this.settings = new modelNs.SettingsModel({});
            this.loadLayout();
        },
        
        loadLayout: function () {
            this.layout = new viewNs.LayoutView({
                model: this.settings,
                $targetButton: this.$targetButton,
                $masks: this.$masks
            });
            this.$renderTo.append(this.layout.render().$el);
            this.layout.initializeControls();
            this.layout.show();
        },
        
        toggle: function () {
            this.layout.toggle();
        }
    });
});
define('module/globalSearch',[
    'cmwTemplate!app/globalSearch/view/tpl/layout.html',
    'cmwTemplate!app/globalSearch/view/tpl/emptySearchResults.html',

    'app/globalSearch/model/SettingsModel',
    'app/globalSearch/view/LayoutView',
    'app/globalSearch/view/StreamView',
    'app/globalSearch/controller/Activity',
    'app/globalSearch/controller/StreamController',
    'app/globalSearch/utils/OperationManager',
    'app/globalSearch/ActivityStreamInitializer',
    'app/globalSearch/Initializer'
], function () {
    "use strict";
    return null;
});
