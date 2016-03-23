/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define('app/settings/awards/AwardsController',['module/userModules'], function () {
    var actionsController;
    var simpleGrid;

    var awdCacheTimeout = null;
    var updateAwardsCache = function() {
        window.clearTimeout(awdCacheTimeout);
        awdCacheTimeout = window.setTimeout(function () {
            shared.services.CacheService.initAwards();
        }, 0);
    };
    
    var updateIcons = function(data) {
        // this is hardcode for predefined icos - can be changed later!
        var pref = data.AwardPicLargeUri && data.AwardPicLargeUri.substr(0, data.AwardPicLargeUri.length - 7);
        data.AwardPicUri = pref ? (pref + '_38.png') : null;
        data.AwardPicSmallUri = pref ? (pref + '_26.png') : null;
        data.AwardPicMediumUri = pref ? (pref + '_48.png') : null;
    };
    
    AwardsController = ActionsController.extend({
        initialize: function (cfg) {
            AwardsController.__super__.initialize.call(this, cfg);
            actionsController = this;
            simpleGrid = actionsController.target;
        },

        routePreview: function (id) {
            if (id == "new")
                this.router.create();
            else
                this.Api.Form.Preview(id);
        },

        routePreviewAndSearch: function (id, name) {
            this.routePreview(id);

            name = name.replace('id-', '');
            simpleGrid.filter(name);
            simpleGrid.widget.config.searchConfig.$renderTo.attr('value', name);
        },

        afterReload: function () {
            $('#loadingForm').hide();
            var selected = simpleGrid.getSelection();
            if (selected && selected.length && selected[0].id.indexOf("tmp") != -1) // is new 
            {
                var data = this.getData();
                selected[0].id = data.id;
                selected[0].AwardPicLargeUri = data.AwardPicLargeUri;
                updateIcons(selected[0]);

                actionsController._last_getFormId = data.id;
                simpleGrid.edit(selected[0].__id, selected[0], selected[0].__line);
                actionsController.moduleRouter.navigateTo('id-' + data.id);
                actionsController.Api.Grid.Edit(selected[0].id, data);
            }
        },
        afterReloadError: function (id) {
            $('#loadingForm').hide();
            var selected = actionsController.target.getSelection();
            simpleGrid.remove(selected[0].__id);
        },
        

        router: {
            save: function (dt, callback) {
                var data = _.clone(dt);
                updateIcons(data);
                if (data.id != 'tmpCategory' && data.id != 'tmpAward' && data.id != null) {
                    Ajax.Settings.EditAward(data, function () {
                        callback && callback();
                        simpleGrid.update();
                        updateAwardsCache();
                    });
                } else {
                    var lastId = data.id;
                    Ajax.Settings.EditAward(data, function (id) {
                        data.id = id;
                        actionsController.Api.Grid.Edit(lastId, data);
                        actionsController.Api.Form.Get(id);
                        callback && callback();
                        updateAwardsCache();
                        //
                    });
                }
            },
            get: function (id, callback) {
                $('#loadingForm').show();
                if (id.indexOf("tmp") != -1) // is new 
                {
                    var currentEl = simpleGrid.getSelection()[0];
                    Ajax.Settings.GetNewAward(actionsController.selectedParent, currentEl.IsGroup, callback);
                    updateAwardsCache();
                }
                else
                    Ajax.Settings.GetAward(id, callback);
            },
            create: function (newObj, callback) {
                var currentEl = simpleGrid.getSelection();
                actionsController.widget.scroller.scrollTo(0);
                actionsController.target.add(newObj, currentEl[0] && currentEl[0].__line || -1);
                actionsController.Api.Form.Preview(newObj.id);
            }
        },
        form: js.widget.form.cmwForm({
            autoSubmit: true,
            config: 'inlineFormNoTooltips',
            name: 'awardDetails',
            cfgType: 'base',
            listeners: {
                destroy: function (e) {
                    $('#' + this.id).remove();
                    delete this.lastForm;
                },
                'afterInited': function () {
                    var input = this.getElementByName('AchivementsList'),
                        self = this;
                    input && input.on('awardGranted', function () {
                        var selected = simpleGrid.getSelection()[0];
                        if (selected.UserCount != input.ValuesCount) {
                            selected.UserCount = input.ValuesCount;
                            simpleGrid.edit(selected.__id, selected, selected.__line);
                        }
                    });
                    input && input.on('show, cancel', function () {
                        self.fire('inputResize');
                        self.fire('scrollDown');
                    });
                },
                'AwardPicNewId>change': function (input, form) {
                    if (!input.smallImage) return;
                    var selected = simpleGrid.getSelection()[0],
                        newSmall = input.smallImage;
                    if (selected.AwardPicUri != newSmall) {
                        selected.AwardPicUri = newSmall;
                        simpleGrid.edit(selected.__id, selected, selected.__line);
                    }
                },
                'UsersCanAwardIt>change':function(input, form) {
                    var aw = shared.services.CacheService.GetAwardById(form.getData('id'));
                    aw.UserCanGrant = input.getValue().indexOf(shared.services.CacheService.CurrentUser.Id) != -1;
                    this.fire("inputResize");
                },
                'AwardPicLargeUri>change': function (input, form) {
                    var dt = {AwardPicLargeUri: input.getValue()};
                    updateIcons(dt);
                    var selected = simpleGrid.getSelection()[0];
                    if (selected.AwardPicUri != dt.AwardPicUri) {
                        _.extend(selected, dt);
                        simpleGrid.edit(selected.__id, selected, selected.__line);
                    };
                },
                'create': function (id) {
                    var data = this.getData();
                    actionsController.router.save(data);
                },
                'delete': function () {
                    $('#loadingForm').show();
                    this.submitting = true;
                    var selection = simpleGrid.getSelection();
                    var __ids = selection.map(function (e) { return e.__id; });
                    var ids = selection.map(function (e) { return e.id; });
                    Ajax.Settings.RemoveAward(ids, function (res) {
                        simpleGrid.remove(__ids);
                        var data = simpleGrid.getData();
                        var next = data.filter(function (row) { return row.__line == selection[0].__line; });
                        if (next && next.length)
                            actionsController.routePreview(next[0].id);
                        else if (data && data.length)
                            actionsController.routePreview(data[0].id);
                        else {
                            actionsController.form.lastForm.destroy();
                            simpleGrid.widget.scroller.scrollTo(0);
                        }
                        $('#loadingForm').hide();
                        updateAwardsCache();
                    });
                }
            }
        })
    });
});

define('text!app/settings/awards/view/tpl/AwardIconSelectorViewTemplate.html',[],function () { return '<img class="NewAward__icon" src="/resources/icons/awards/{{name}}_94.png" />';});



define('text!app/settings/awards/view/tpl/AwardIconSelectorEditTemplate.html',[],function () { return '<div class="user-avatar"><img src="/resources/icons/awards/{{display.value}}_94.png" class="NewAward__icon" /></div>';});



define('text!app/settings/awards/view/tpl/AwardIconSelectorTemplateView.html',[],function () { return '<div>\r\n    {{if collection.length && value}}\r\n    <div class="user-avatar award-big">\r\n        <img src="{{value}}" />\r\n    </div>\r\n    {{/if}}\r\n</div>';});



define('text!app/settings/awards/view/tpl/AwardIconSelectorTemplateEdit.html',[],function () { return '<div class="awards-edit-except">\r\n    {{if collection.length}}\r\n        {{if value}}\r\n        <div class="user-avatar">\r\n            <img src="{{value}}" />\r\n        </div>\r\n        {{/if}}\r\n\r\n        <div class="select-award" [%menuContainer%]></div>\r\n    {{/if}}\r\n</div>';});



define('text!app/settings/awards/view/tpl/AwardIconSelectorItemTemplate.html',[],function () { return '<img src="{{String.prototype.replace.call(id + "", 94, 38)}}" width="38" height="38" alt="" class="select-award__icon" />\r\n';});



define('text!app/settings/awards/view/tpl/AchievementTooltip.html',[],function () { return '<div class="achievement-tip">\r\n    <div class="rewards__title">{{awardName}}</div>\r\n    <div>{{comment}}</div>\r\n    <div class="rewards__footer">{{{this.Localizer(\'PROJECT.SETTINGS.AWARDSTAB.ACHIEVEMENTTOOLTIP.AWARDEDBY\')}}} <a href="{{awardedByLink}}">{{awardedByName}}</a> {{awardDateText}}</div>\r\n</div>';});



define('text!app/settings/awards/view/tpl/AwardItemForAwardView.html',[],function () { return '<a class="awards-list__laureate" data-count="{{awardCount}}" href="{{{this.getUrl(\'Person\', awardedUser)}}}">\r\n    {{if awardedUserPic}} \r\n        <img src="{{awardedUserPic}}" alt="" width="24" height="24" class="avatar-icon avatar-icon_members-list"/>\r\n    {{else}}\r\n        <span class="avatar-icon avatar-icon_members-list">{{awardedUserAbbreviation}}</span>\r\n    {{/if}}\r\n    {{awardedUserName}}\r\n</a>';});



define('text!app/settings/awards/view/tpl/AwardItemForAwardViewGranter.html',[],function () { return '<div class="button-icon button-icon_add-member AwardGranter" title="{{{this.Localizer(\'PROJECT.SETTINGS.AWARDSTAB.GRANTAWARDBUTTON.TOOLTIP\')}}}">{{{this.Localizer(\'PROJECT.SETTINGS.AWARDSTAB.GRANTAWARDBUTTON.TOOLTIP\')}}}</div>\r\n';});



define('text!app/settings/awards/view/tpl/AwardItemForUserView.html',[],function () { return '<img src="{{awardPicUri}}" width="38" height="38" alt="{{awardName}}" class="awards-list__img" />';});



define('text!app/settings/awards/view/tpl/AwardItemForUserViewGranter.html',[],function () { return '<div class="awards-list__button AwardGranter AwardGranterInUser" title="{{{this.Localizer(\'PROJECT.SETTINGS.AWARDSTAB.GRANTAWARDBUTTON.TOOLTIP\')}}}"></div>';});



define('text!app/settings/awards/view/tpl/AwardList.html',[],function () { return '<div class="tr-list__item tr-list__item__setting {{row.__selected?\' selected\':\'\'}}">\r\n    <div class="{{cls}}">\r\n        <img class="tr-list__icon-awatar" src="{{row.AwardPicUri}}"/>\r\n        <div class="tr-list__title jsTitle">{{{this.highlightFilter(row.Name)}}}</div>\r\n        <div class="tr-list__description">{{{this.laureatesText(row)}}}</div>\r\n    </div>\r\n</div>';});


/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define('app/settings/awards/model/AwardSetCollectionModel',['module/shared'], function (moduleShared) {
    var awardsModel = window.ClassLoader.createNS("app.administration.awards.model");
    //fields for item:
    //awardId
    //awardName
    //awardCount
    //awardPicUri
    //awardGrants - Array of awardGrant
    // awardGrant - { date, text,awardedBy, array of targets who can see it? } 
    var dateFormatterHelper = shared.general.DateFormatterHelper;
    var now = new Date();
    awardsModel.AwardSetCollectionModel = Backbone.Collection.extend({
        initialize: function (models, options) {
            this.options = _.clone(options);
        },
        getTipCollection: function (m) {
            if (!this.tipCollection) {
                this.tipCollection = new Backbone.Collection();
            }
            var agrants = m.get('awardGrants');
            this.tipCollection.reset(agrants);
            return this.tipCollection;
        },

        comparator: function (m1, m2) {
            if (m1.get("granter")) {
                return 1;
            }
            if (m2.get("granter")) {
                return -1;
            }
            var v1, v2;
            if (this.options.mode == 'SortByAward') {
                var awDate1 = m1.get("awardGrants");
                v1 = awDate1 && awDate1.length && awDate1[0].date && now - awDate1[0].date;
                var awDate2 = m2.get("awardGrants");
                v2 = awDate2 && awDate2.length && awDate2[0].date && now - awDate2[0].date;
            } else {
                v1 = (m1.get('awardedUserName') || '').toLowerCase();
                v2 = (m2.get('awardedUserName') || '').toLowerCase();
            }
            if (v1 > v2) return 1;
            if (v2 > v1) return -1;
            return 0;
        },
        appendAchievement: function (a) {
            this.sourceData.push(a);
            this.reloadData();
        },
        loadData: function (data) {
            this.sourceData = data || [];
            this.reloadData();
        },
        reloadData: function () {
            /*
                AchievementComment
                AchievementDate
                AwardId
                AwardName
                AwardedUsers
                AwardPicUri
            */
            var data = this.sourceData;
            var map = {};
            var newdata = [];
            var aw;
            for (var i = 0, l = data.length; i < l; i++) {
                // used when we look into set from user card or award card
                if (!data[i].AwardedUsers) {
                    throw 'Inconsistent Achievement Model: AwardedUsers required';
                }
                for (var j = 0, jl = data[i].AwardedUsers.length; j < jl; j++) {
                    var index = this.options.mode == 'SortByAward' ? data[i].AwardId : data[i].AwardedUsers[j];
                    aw = map[index];
                    if (!aw) {
                        var awUser = shared.services.CacheService.GetUserById(data[i].AwardedUsers[j]);
                        var cAward = shared.services.CacheService.GetAwardById(data[i].AwardId);
                        if (!awUser) {
                            console.log2 && console.log2('User not found for award', data[i].AwardedUsers[j])
                            continue;
                        }
                        aw = {
                            awardId: data[i].AwardId,
                            awardName: (cAward && cAward.Name) || data[i].AwardName,
                            awardPicUri: (cAward && cAward.AwardPicUri) || data[i].AwardPicUri,
                            awardCount: 0,
                            awardedUser: data[i].AwardedUsers[j],
                            awardedUserName: awUser.Text,
                            awardedUserPic: awUser.userpicUri,
                            awardedUserAbbreviation: awUser.abbreviation,
                            awardGrants: []
                        };
                        map[index] = aw;
                        newdata.push(aw);
                    }
                    aw.awardCount++;
                    var awDer = shared.services.CacheService.GetUserById(data[i].AwardedBy);
                    aw.awardGrants.push({
                        date: new Date(data[i].AchievementDate),
                        id: data[i].Id,
                        awardDateText: dateFormatterHelper.DateTime(data[i].AchievementDate),
                        comment: data[i].AchievementComment,
                        awardedBy: data[i].AwardedBy,
                        awardedByLink: moduleShared.services.ModuleService.getModuleUrlByName('user', moduleShared.services.ModuleService.modules.PEOPLE_USERS, {
                            userId: data[i].AwardedBy
                        }),
                        awardName: data[i].AwardName || (cAward && cAward.Name),
                        awardedByName: (awDer && awDer.Text) || data[i].AwardedBy
                    });
                }
            }
            for (var i = 0, il = newdata.length; i < il; i++) {
                var aw = newdata[i];
                aw.awardGrants.sort(function (a, b) {
                    a = a.date;
                    b = b.date;
                    return a > b ? -1 : a < b ? 1 : 0;
                });
            }
            if (this.options.canGrant) {
                newdata.push({ granter: true });
            }
            this.reset(newdata);
        }
    });
});
/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define('app/settings/awards/view/AwardSetCollection',['module/userModules', 'module/shared'], function (userModules, shared) {
    'use strict';
    var awardsView = window.ClassLoader.createNS("app.administration.awards.view"),
        nsActivity = window.ClassLoader.createNS("app.mywork.activity");

    awardsView.AchievementTooltipItemView = Backbone.Marionette.ItemView.extend({
        template: 'AchievementTooltip',
        triggers: {
            'click .rewards__title': 'itemClick'
        }

    });
    awardsView.TipView = classes.shared.view.ViewCollectionAsGallery.extend({
        childViewType: awardsView.AchievementTooltipItemView,
        onAfterItemRender: function (view) {
            view.on("itemClick", function (opts) {
                this.trigger('childview:itemClick', opts.model)
            }, this);
        }
    });

    awardsView.AwardSetCollection = Backbone.Marionette.CompositeView.extend({
        className: 'awards-list-container',
        childViewContainer: '.awards-list',
        bubbleEvents: ["resize", "cancel", "show"],
        events: {
            "click .AwardGranter": "grantAward",
            "keydown": "handleKey"
        },
        options: {
            tipShowDelay: 300,
            tipHideDelay: 400
        },
        template: function () { return "<div class='awards-list'></div>"; },
        gotoAchievement: function (id) {
            var linker = _.getWindowPropIfHas("shared.services.LinkService");
            if (linker) {
                var url = linker.GetLink('Achievement', id, true);
                shared.services.RoutingService.navigateToUrl(url);
            }
        },
        getChildView: function (item) {
            var v;
            var cfg = {
                className: "awards-list__item"
            };
            var granter = item.get('granter') == true;
            if (this.options.mode == 'SortByUser') {
                v = 'AwardItemForAwardView';
            } else {
                v = 'AwardItemForUserView';
            }
            if (granter) {
                v += 'Granter';
            }
            if (!awardsView[v]) {
                cfg.template = v;
                if (!granter) {
                    cfg.triggers = {
                        'mouseover': 'mouseover',
                        'mouseleave': 'mouseleave'
                    };
                }
                awardsView[v] = Backbone.Marionette.ItemView.extend(cfg);
            }
            return awardsView[v];
        },
        onRender: function () {
            if (this.options.disabled) {
                this.hideGranter();
            }
        },
        hideTip: function () {
            this.tipEl && this.tipEl.hide();
            this.currentTipModel = null;
        },
        showTip: function (itemModel, pos) {
            if (!this.TipView) {
                var self = this;
                this.tipEl = $('<div style="display:none"></div>');
                this.$el.append(this.tipEl);
                this.tipEl.mouseenter(function () {
                    //prevent hide
                    if (self.hideTimeout) {
                        window.clearTimeout(self.hideTimeout);
                        self.hideTimeout = 0;
                    }
                    //prevent show other
                    if (self.showTimeout) {
                        window.clearTimeout(self.showTimeout);
                        self.showTimeout = 0;
                        self.pendingTipModel = null;
                    }
                });
                this.tipEl.mouseleave(function () {
                    if (!self.hideTimeout) {
                        self.hideTimeout = window.setTimeout(function () {
                            self.hideTip();
                        }, self.options.tipHideDelay);
                    } else {
                        throw 'it was not designed this way';
                    }
                });
                this.TipView = new awardsView.TipView({
                    collection: this.collection.getTipCollection(itemModel)
                });
                this.TipView.on('childview:itemClick', function (model) {
                    self.gotoAchievement(model.get('id'));
                });
            } else {
                this.collection.getTipCollection(itemModel);
            }

            this.tipEl.hide();
            this.tipEl.html();
            this.TipView.render();
            this.tipEl.append(this.TipView.$el);

            //todo calculate if it vmeshaetsya
            //show the menu directly over the placeholder
            this.tipEl.css({
                position: "absolute",
                top: pos.top + "px",
                left: pos.left + "px"
            }).show();
            this.currentTipModel = itemModel;
        },
        onChildviewMouseover: function (a1, a2) {
            var self = this;
            var mdl = a2.model;
            if (this.hideTimeout && this.currentTipModel == mdl) {
                window.clearTimeout(this.hideTimeout);
                this.hideTimeout = 0;
            }
            if ((!this.pendingTipModel && this.currentTipModel != mdl) || this.pendingTipModel != mdl) { // shown something else or pending show something else
                if (this.showTimeout) {
                    window.clearTimeout(this.showTimeout);
                    this.showTimeout = 0;
                }
                this.pendingTipModel = mdl;
                var pos = a2.view.$el.position();
                pos.left += a2.view.$el.outerWidth() / 2;
                pos.left -= 150;
                pos.top += 45;
                this.showTimeout = window.setTimeout(function () {
                    self.showTip(mdl, pos);
                    self.pendingTipModel = null;
                    window.clearTimeout(self.hideTimeout);
                    self.hideTimeout = 0;
                }, this.options.tipShowDelay);
            }
        },
        onChildviewMouseleave: function (a1, a2, a3) {
            var self = this;
            var mdl = a2.model;
            if (this.pendingTipModel == mdl) {
                if (this.showTimeout) {
                    window.clearTimeout(this.showTimeout);
                    this.showTimeout = 0;
                    this.pendingTipModel = null;
                }
            }
            if (!this.hideTimeout && this.currentTipModel == mdl) {
                this.hideTimeout = window.setTimeout(function () {
                    if (self.currentTipModel == mdl) {
                        self.hideTip();
                    }
                }, this.options.tipHideDelay);
            }
        },
        hideGranter: function () {
            if (this.awGranter) {
                this.awGranter.hide();
                this.awGranter.$el.detach();
            }
        },
        grantAward: function () {
            if (!this.awGranter) {
                this.awGranter = new nsActivity.view.NewAwardView({ model: new Backbone.Model({ type: "NewAward", Me: shared.services.CacheService.CurrentUser }) });

                var _self = this;
                this.bubbleEvents.map(function (eventName) {
                    _self.awGranter.on(eventName, function () {
                        _self.trigger(eventName);
                    });
                });

                var self = this;
                this.awGranter.options.customAction = function (notUsed, usersIds, awardId, comment, announceIds, callback) {
                    if (!_.getWindowPropIfHas('Ajax.People.CreateAchievement')) {
                        throw 'Ajax People CreateAchievement required';
                    }
                    var cb = function (achievementId) {
                        self.hideGranter();
                        self.collection.appendAchievement({
                            Id: achievementId,
                            AchievementComment: comment,
                            AchievementDate: new Date(),
                            AwardId: awardId,
                            AwardName: null,
                            AwardedUsers: usersIds,
                            AwardPicUri: null,
                            AwardedBy: shared.services.CacheService.CurrentUser.Id,
                            AwardedByLink: shared.services.ModuleService.getModuleUrlByName('user', shared.services.ModuleService.modules.PEOPLE_USERS, {
                                userId: shared.services.CacheService.CurrentUser.Id
                            })
                        });
                        callback && callback();
                        self.trigger('awardGranted');
                    };
                    Ajax.People.CreateAchievement(usersIds, awardId, comment, announceIds, cb);
                }

                if (this.options.mode == 'SortByUser') {
                    if (!this.options.awardId) {
                        throw 'If mode = SortByUser then awardId required';
                    }
                    this.awGranter.model.set('fixedAward', this.options.awardId);
                } else if (this.options.mode == 'SortByAward') {
                    if (!this.options.userId) {
                        throw 'If mode = SortByUser then userId required';
                    }
                    this.awGranter.model.set('fixedUser', this.options.userId);
                }
            }
            this.$el.append(this.awGranter.render());
            this.awGranter.show();
        },
        handleKey: function (ev) {
            if (ev.keyCode == 27) {
                this.hideGranter();
            }
            ev.stopPropagation();
        }
    });
});
/**
 * Developer: Peter Volynsky
 * Date: 24.10.13
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */
define('app/settings/awards/field/AwardSetField',['module/userModules'], function () {
    base = 'js.widget.field.BaseField';
    js.ui.WidgetFactory('app.administration.awards.field.AwardSetField', {
        takeChild: false,
        manualDraw: true,
        implement: ['js.util.Observable'],
        bubbleEvents: ["resize", "awardGranted", "cancel", "show"],
        autoBlur : false,
        
        ctor: function (cfg) {
            this.dataCollection = new classes.app.administration.awards.model.AwardSetCollectionModel(null, {
                mode: this.mode,
                canGrant: (!cfg.mode || cfg.mode != 'SortByAward') ? true : shared.services.CacheService.GetGrantableAwards().length != 0
            });

            this.display = {};
            this.$call(base, 'ctor')(cfg);
            this.mode = cfg.mode || 'SortByAward';
            this.awardId = cfg.awardId;
            this.userId = cfg.userId;
            this.disabled = cfg.disabled;

        },
        listeners: {
            blur: function () {
                this.bbView && this.bbView.hideGranter();
            },
            afterDraw: function () {
                this.bbView = new classes.app.administration.awards.view.AwardSetCollection({
                    collection: this.dataCollection,
                    mode: this.mode,
                    awardId: this.awardId,
                    userId: this.userId,
                    disabled: this.disabled
                });
                
                var _self = this;
                this.bubbleEvents.map(function (eventName) {
                    _self.bbView.on(eventName, function () {
                        _self.fire(eventName);
                    });
                });

                this.bbView.on('awardGranted', function () {
                    this.ValuesCount = this.dataCollection.length - (this.dataCollection.options.canGrant ? 1 : 0);
                }, this);
                
                this.bbView.render();
                var rt = $(this.renderTo);
                rt.html('');
                rt.append(this.bbView.$el);
            }
        },        
        dataSetter: function (value) {
            this.dataCollection.loadData(value);
            this._lastValue = this.value = value;
        },
        getValue: function () {
            return this._lastValue;
        }
    }, base);
});
define([
    'app/settings/awards/AwardsController',
    'cmwTemplate!app/settings/awards/view/tpl/AwardIconSelectorViewTemplate.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardIconSelectorEditTemplate.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardIconSelectorTemplateView.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardIconSelectorTemplateEdit.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardIconSelectorItemTemplate.html',
    'cmwTemplate!app/settings/awards/view/tpl/AchievementTooltip.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardItemForAwardView.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardItemForAwardViewGranter.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardItemForUserView.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardItemForUserViewGranter.html',
    'cmwTemplate!app/settings/awards/view/tpl/AwardList.html',
    'app/settings/awards/model/AwardSetCollectionModel',
    'app/settings/awards/view/AwardSetCollection',
    // fields
    'app/settings/awards/field/AwardSetField'
]);
