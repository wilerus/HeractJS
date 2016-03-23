
define('text!app/settings/activedirectoryintegration/view/tpl/AdGroupList.html',[],function () { return '<div class="tr-list__item tr-list__item_adi{{row.__selected ?\' selected\':\'\'}}{{row.selectedToPrevSync?\' synchronized\':\'\'}}" groupId ="{{row.Id}}">\r\n    <div style="display: none">{{row.Abbreviation}}</div>\r\n    {{if row.IsGroup }}\r\n        <span class="avatar-icon avatar-icon_adi-ugroup"></span>\r\n        <div class="tr-list__title tr-list__title_adi{{row.Description?\'\':\' tr-list__title_middle\'}}">\r\n            {{{this.highlightFilter(row.Name)}}}\r\n        </div>\r\n        <span class="tr-list__adi-count">{{row.MembersCount}} user{{if row.MembersCount > 1}}s{{/if}}</span>\r\n        {{if (row.Description)}}\r\n            <div class="tr-list__description">{{{this.highlightFilter(row.Description)}}}</div>\r\n        {{/if}}\r\n    {{else}}\r\n        {{if (row.Userpic)}}\r\n            <img src="data:image/png;base64,{{row.Userpic}}" alt="" width="32" height="32" class="avatar-icon" />\r\n        {{else}}\r\n            <span class="avatar-icon avatar-icon_adi">{{row.Abbreviation}}</span>\r\n        {{/if}}\r\n        <div class="tr-list__title tr-list__title_middle">\r\n            {{{this.highlightFilter(row.Name)}}}\r\n        </div>\r\n    {{/if}}\r\n</div>';});


define('app/settings/activedirectoryintegration/AdIntegration',['module/userModules'], function() {
    AdIntegration = {
        adIsEnabled: false,
        groupsIsEnabled: true,
        usersIsEnabled: true,
        dlgSettings: null,
        groupsSimpleGrid: null,

        /*data__*/
        groupsData: null,
        usersData: null,
        server: null,
        baseDn: null,
        login: null,
        password: null,
        enableAutosync: null,
        /*data__*/

        scroller: null,
        serverSettingForm: null,
        syncIntervalId: undefined,
        syncIsCompleted: true,
        userAndGroupsForm: null,
        scheduledImportForm: null,
        lastImportForm: null,

        ctor: function(_adIsEnabled) {
            _.extend(this, {
                settingDialog: $('#settingsDlg'),
                pnlContent: $('#settingsDlg .adi-content'),
                pnlError: $('#pnlError'),
                $pnlChangeSettingImport: $('#pnlChangeSettingImport'),
                $changeSettingButtons: function() { return $('#changeSettingButtons'); },
                $pnlAdIsEnabled: $('#adIsEnabled'),
                $pnlAdIsDisabled: $('#adIsDisabled'),
                $pnlMainContent: $("#activeDirectoryContent"),

                $btnEnableAd: $('#btnEnableAd'),
                $btnDisabledAd: $('#btnDisableAd'),
                $btnCloseSettings: $('#closeTab'),

                $bntImportNowFn: function() { return $('#btnImportNow'); },
                $btnChangeSettingImportFn: function() { return $('#btnChangeSettingImport'); },
                $fldLastImportDate: function() { return $('#lastImportDate'); },

                $menuItems: $('.adi-menu__item')
            });
            var _self = this;
            this.adIsEnabled = _adIsEnabled;

            this.scroller = js.ui.SimpleScroller({
                scrollArea: _self.$pnlMainContent[0]
            });

            if (this.adIsEnabled === true) {
                this.$pnlAdIsEnabled.show();
                this.$pnlAdIsDisabled.hide();
                this.$pnlMainContent.addClass('adi_enable');
                this.getLastImport();
            } else {
                this.$pnlAdIsDisabled.show();
                this.$pnlAdIsEnabled.hide();
            }

            this.$btnEnableAd.click(this.clickEnableAd.bind(this));
            this.$btnDisabledAd.click(this.clickDisabledAd.bind(this));
            this.$btnCloseSettings.click(this.closeDlgSettings.bind(this));
        },

        //#region Load partial views

        getAdSettings: function(callback) {
            var _self = this;
            $('#loading').fadeIn();
            Ajax.Settings.GetAdServerSettings({
                dataType: 'html',
                ownHandler: true,
                success: function(htmlRes) {
                    var success = function() {
                        $('#loading').fadeOut();
                        _self.getAdSettings__init();
                        this.selectStage(0);
                        this.pnlError.html('');
                        this.pnlContent
                            .hide()
                            .html(htmlRes)
                            .fadeIn();
                        this.settingDialog.show();
                        _self.scroller.update(true);
                    }.bind(this);
                    typeof callback === 'function' ? callback(success) : success();
                }.bind(this),
                error: function() {
                    //KRIS: server validation
                    $('#loading').fadeOut();
                    callback && callback();
                }
            });
        },

        getAdSettings__init: function() {
            var _self = this;
            this.serverSettingForm = js.widget.form.cmwForm({
                name: 'adServerSettings',
                cfgType: 'base',
                config: 'inlineForm',
                tooltipCfg: {
                    position: 'bottom'
                },
                listeners: {
                    'Server>change': function() {
                        this.getElementByName("DN").setValue(_self.calcBaseDN(this.getElementByName("Server").getValue()));
                    },
                    getUsers: function() {
                        this.validate() && _self.getUsers();
                    },
                    afterInited: function() {
                        if (_self.server) _self.serverSettingForm.lastForm.getElementByName('Server').setValue(_self.server);
                        if (_self.baseDn) _self.serverSettingForm.lastForm.getElementByName('DN').setValue(_self.baseDn);
                        if (_self.login) _self.serverSettingForm.lastForm.getElementByName('Login').setValue(_self.login);
                        if (_self.password) _self.serverSettingForm.lastForm.getElementByName('Password').setValue(_self.password);
                    },
                    btnClose: function() {
                        _self.closeDlgSettings();
                    }
                }
            });
        },

        getUsers: function() {
            var _self = this;
            $('#loading').fadeIn();
            /*it's need if we back from schedule settings*/
            _self.server = this.serverSettingForm.lastForm.getElementByName('Server').getValue();
            _self.baseDn = this.serverSettingForm.lastForm.getElementByName('DN').getValue();
            _self.login = this.serverSettingForm.lastForm.getElementByName('Login').getValue();
            _self.password = this.serverSettingForm.lastForm.getElementByName('Password').getValue();

            Ajax.Settings.GetAdUsers({
                    Server: _self.server,
                    DN: _self.baseDn,
                    Login: _self.login,
                    Password: _self.password
                }, {
                    dataType: 'html',
                    ownHandler: true,
                    success: function(htmlRes) {
                        $('#loading').fadeOut();
                        var jsonRes = null;
                        try {
                            jsonRes = JSON.parse(htmlRes);
                        } catch(ex) {
                        }
                        if (jsonRes && jsonRes.success === false) {
                            _self.serverSettingForm.lastForm.showServerErrors(jsonRes.extraData || {});
                        } else {
                            _self.getUsers__init();
                            _self.selectStage(1);
                            _self.pnlError.html('');
                            _self.pnlContent
                                .animate({ opacity: 0 }, function() {
                                    _self.pnlContent.html(htmlRes)
                                        .animate({ opacity: 1 });
                                    _self.getUsers__afterLoad();
                                });
                        }
                    },
                    error: function(res) {
                        $('#loading').fadeOut();
                        _self.serverSettingForm.lastForm.showServerErrors(res.extraData || {});
                    }
                });
        },

        getUsers__init: function() {
            var _self = this;

            this.userAndGroupsForm = js.widget.form.cmwForm({
                name: 'adUsersAndGroups',
                cfgType: 'base',
                config: 'inlineForm',
                listeners: {
                    afterInited: function () {
                        _initSearch();
                    },
                    'CurrentUserFilterS>change': function(element, form) {
                        switch (element.value) {
                        case 'ShowUsers':
                            _self.groupsSimpleGrid.columnFilter({ IsGroup: 'false' });
                            _self.groupsSimpleGrid.sortBy([{ column: '__selected', order: 'desc' }, { column: 'Name', order: 'asc' }]);
                            break;
                        case 'ShowGroups':
                            _self.groupsSimpleGrid.columnFilter({ IsGroup: 'true' });
                            _self.groupsSimpleGrid.sortBy([{ column: '__selected', order: 'desc' }, { column: 'Name', order: 'asc' }]);
                            break;
                        case 'ShowUsersAndGroups':
                            _self.groupsSimpleGrid.columnFilter();
                            _self.groupsSimpleGrid.sortBy([{ column: '__selected', order: 'desc' }, { column: 'Name', order: 'asc' }]);
                            break;
                        }
                    },
                    btnNext: function() {
                        _self.getScheduledImport();
                        ;
                    },
                    btnBack: function() {
                        _self.getAdSettings();
                    },
                    btnSearchUsersAndGroups: function() {
                        var $searchInput = $('#searchUsersAndGroups');
                        if ($searchInput.css('display') == 'none') {
                            $('#countUsersAndGroupsWrapper').hide();
                            $('#btnSearchUsersAndGroupsWraper').addClass('adi-seach__button_active');
                            $searchInput.show();
                            $searchInput.animate({ width: 330 }, 600, 'easeOutQuart', function () {
                                $('#searchUsersAndGroups_input').focus();
                            });
                        } else {
                            $searchInput.animate({ width: 0 }, 600, 'easeOutQuart', function() {
                                $searchInput.hide();
                                $('#btnSearchUsersAndGroupsWraper').removeClass('adi-seach__button_active');
                                $('#countUsersAndGroupsWrapper').show();
                            });
                        }
                    },
                    btnSelectAll: function() {
                        _self.selectAllGroupsGrid(true);
                    },
                    btnDeselectAll: function() {
                        _self.selectAllGroupsGrid(false);
                    },
                    btnClose: function() {
                        _self.closeDlgSettings();
                    }
                }
            });

            var _initSearch = function() {
                var searchField = $('#searchUsersAndGroups_input'),
                    searchChanged = function() {
                        var hasText = !!$('#searchUsersAndGroups_input').val();
                        $('#searchUsersAndGroups_clearText').toggle(hasText);
                    };
                $('#searchUsersAndGroups_clearText').click(function() {
                    $('#searchUsersAndGroups_input').val('');
                    _self.groupsSimpleGrid.searchConfig.gridFilter('');
                });
                js.util.Dom.addRemovableListener(searchField[0], 'keyup', searchChanged);
                js.util.Dom.addRemovableListener(searchField[0], 'change', searchChanged);
                js.util.Dom.addRemovableListener(searchField[0], 'mouseup', searchChanged);
            };
        },

        getUsers__afterLoad: function() {
            this.usersIsEnabled = window.Context.usersIsEnabled;
            this.groupsIsEnabled = window.Context.groupsIsEnabled;
            this.groupsData = window.Context.groupsData;
            this.usersData = window.Context.usersData;
            this.initGroupsGrid();
        },

        getScheduledImport: function(callback) {
            var _self = this;
            Ajax.Settings.GetScheduledImportSettings({
                dataType: 'html',
                ownHandler: true,
                success: function(htmlRes) {
                    var success = function() {
                        _self.getScheduledImport__init();
                        _self.selectStage(2);
                        _self.pnlError.html('');
                        _self.pnlContent
                            .hide()
                            .html(htmlRes)
                            .fadeIn();
                    };
                    typeof callback === 'function' ? callback(success) : success();
                },
                error: function() {
                    $('#loading').fadeOut();
                    callback && callback();
                }
            });
        },

        getScheduledImport__init: function() {
            var _self = this;
            this.scheduledImportForm = js.widget.form.cmwForm({
                name: 'scheduledImportForm',
                cfgType: 'base',
                config: 'inlineForm',
                listeners: {
                    btnNext: function() {
                        _self.startImport();
                    },
                    btnBack: function() {
                        _self.getUsers();
                    },
                    btnClose: function() {
                        _self.closeDlgSettings();
                    }
                }
            });
        },

        getLastImport: function(pnl, callback) {
            var _self = this;
            var tPnl = pnl || _self.$pnlChangeSettingImport;
            tPnl.html('<div id="loadingAdState" class="defaultLoading">Loading state..</div>');
            $('#loadingAdState').show();
            Ajax.Settings.GetLastImport({
                dataType: 'html',
                ownHandler: true,
                success: function(htmlRes) {
                    var success = function() {
                        _self.getLastImport__init();
                        var tPnl = pnl || _self.$pnlChangeSettingImport;
                        _self.pnlError.html('');
                        tPnl.hide()
                            .html(htmlRes)
                            .fadeIn();

                    };
                    typeof callback === 'function' ? callback(success) : success();
                },
                error: function(el) {
                    callback && callback();
                    $('#loadingAdState').hide();
                    pnlError.hide().html('(todo localization) State is not loaded. Exceptioncode:' + el.exceptionCode).fadeIn();
                }
            });
        },

        getLastImport__init: function() {
            var _self = this;
            this.lastImportForm = js.widget.form.cmwForm({
                name: 'lastImport',
                cfgType: 'base',
                config: 'inlineForm',
                listeners: {
                    'EnableDataModificationS>change': function(el) {
                        _self.setEnableDataModification(el.value);
                    },
                    btnChangeSettingImport: function() {
                        _self.changeSettingImport.bind(_self)();
                    },
                    btnStopAndChangeSettingImport: function() {
                        _self.stopAndChangeSettingImport.bind(_self)();
                    },
                    btnImportNow: function() {
                        _self.openDlgSync.bind(_self)();
                    }
                }
            });
        },

        //#endregion Load partial views

        enableAdIntegration: function(callback) {
            var _self = this;
            Ajax.Settings.EnableAdIntegration(
                this.adIsEnabled,
                {
                    ownHandler: true,
                    success: function(res) {
                        var success = function() {
                        };
                        typeof callback === 'function' ? callback(success) : success();
                        window.application.navigationController.reload();
                    },
                    error: function() {
                        callback && callback();
                    }
                });
        },

        importNow: function() {
            $('#btnChangeSettingWraper').hide();
            $('#btnStopAndChangeSettingWraper').show();
            var _self = this;
            Ajax.Settings.ImportNow({
                dataType: 'html',
                ownHandler: true,
                success: function(htmlRes) {
                    _self.selectStage(3);
                    _self.pnlError.html('');
                    _self.pnlContent
                        .hide()
                        .html(htmlRes)
                        .fadeIn();
                    /* $('#settingsDlg').show();*/
                },
                error: function() {
                    throw "Can't start import now";
                    //KRIS: server validation  
                }
            });
        },

        startImport: function(callback) {
            var _self = this;
            $('#loading').fadeIn();
            this.enableAutosync = (this.scheduledImportForm.lastForm.getElementByName('SetupScheduledImportS').getValue() == 'Enable');
            Ajax.Settings.StartImport(
                { Server: _self.server, DN: _self.baseDn, Login: _self.login, Password: _self.password },
                _self.groupsSimpleGrid.getSelection().filter(function(n) { return n.IsGroup == true; }).map(function(n) { return n.Id; }),
                _self.groupsSimpleGrid.getSelection().filter(function(n) { return n.IsGroup == false; }).map(function(n) { return n.Id; }),
                true, {
                    dataType: 'html',
                    ownHandler: true,
                    success: function(htmlRes) {
                        $('#loading').fadeOut();
                        _self.selectStage(3);
                        _self.pnlError.html('');
                        _self.pnlContent
                            .hide()
                            .html(htmlRes)
                            .fadeIn();
                        _self.adIsEnabled = true;
                        _self.$pnlMainContent.addClass('adi_enable');
                        $('#adIsDisabled').fadeOut();
                        $('#adIsEnabled').fadeIn();

                        window.application.navigationController.reload();
                    },
                    error: function() {
                        //todo: 
                        $('#loading').fadeOut();
                        callback && callback();
                    }
                });
        },

        initGroupsGrid: function() {
            var _self = this;
            var groupsColumns =
            [{ id: "Name", name: "Name", type: 'text', editable: false, sortType: 'TextCaseInsensetive' },
                { id: "Id", name: "Id", type: 'text', editable: false },
                { id: "IsGroup", name: "IsGroup", type: 'boolean', editable: false, hidden: true }];

            this.groupsData = this.groupsData.map(function(row) {
                return {
                    Id: row.Id,
                    Name: row.Name,
                    selectedToPrevSync: row.SelectedToSync,
                    __selected: row.SelectedToSync,
                    IsGroup: true,
                    MembersCount: row.MembersCount,
                    Description: row.Description,
                    Abbreviation: row.Abbreviation
                };
            });

            this.usersData = this.usersData.map(function(row) {
                return {
                    Id: row.Id,
                    Name: row.Name,
                    selectedToPrevSync: row.SelectedToSync,
                    __selected: row.SelectedToSync,
                    IsGroup: false,
                    Userpic: row.Userpic,
                    Abbreviation: row.Abbreviation
                };
            });

            this.groupsSimpleGrid = js.widget.grid.SimpleGrid({
                tpl: 'AdGroupList',
                renderTo: $('#groupGrid')[0],
                resizable: true,
                sortable: true,
                absolute: false,
                hasTitle: false,
                multiselect: true,
                searchConfig: {
                    $renderTo: $('#searchUsersAndGroups_input'),
                },
                model: {
                    data: [],
                    columns: groupsColumns,
                    sort: []
                },

                listeners: {
                    ready: function() {
                        _self.groupsSimpleGrid.add(_self.usersData);
                        _self.groupsSimpleGrid.add(_self.groupsData);
                        _self.groupsSimpleGrid.sortBy([{ column: '__selected', order: 'asc' }, { column: 'Name', order: 'asc' }]);
                        _self.userAndGroupsForm.lastForm.getElementByName('CurrentUserFilterS').fire('change');
                        _self.calcUserAndGroupSelectedCount();
                    },
                    element_selected: function(id, cell, data, controller, el, e, columns, eDown, eUp, grid) {
                        _self.calcUserAndGroupSelectedCount();
                    }
                }
            });


        },

        setEnableDataModification: function(enable) {
            var isSetted = false;
            Ajax.Settings.EnableDataModification(enable, function(e) {

            });
            return isSetted;
        },

        calcBaseDN: function(srvhostname) {
            if (srvhostname) {
                var dcs = srvhostname.split('.');
                if (dcs.length > 2)
                    dcs.shift();
                return 'CN=Users,DC=' + dcs.join(',DC=');
            }
            return null;
        },

        calcUserAndGroupSelectedCount: function() {
            var usersCount, groupsCount;
            usersCount = (this.groupsSimpleGrid.getSelection().filter(function(n) { return n.IsGroup == false; })).length;
            groupsCount = (this.groupsSimpleGrid.getSelection().filter(function(n) { return n.IsGroup == true; })).length;
            $('#usersCount').html(usersCount);
            $('#groupsCount').html(groupsCount);
        },
        /*ui__*/

        selectAllGroupsGrid: function(selectValue) {
            var model = this.groupsSimpleGrid.widget.dataSource.model,
                length = model.store.data.length,
                selected = model.store.data.data.__selected;
            for (var i = 0; i < length; i++)
                selected[i] = selectValue;
            model.store.remakeHash();
            model.updateData();
            this.calcUserAndGroupSelectedCount();
        },

        selectStage: function(stageNmb) {
            this.$menuItems.removeClass('selected');
            this.$menuItems[stageNmb].className += ' selected';
        },

        changeSettingImport: function() {
            this.$changeSettingButtons().hide();
            this.openDlgSettings();
        },

        stopAndChangeSettingImport: function() {
            var _self = this;
            Ajax.Settings.StopSync(function(res, success) {
                if (success.success == true) {
                    _self.stopSync();
                    _self.changeSettingImport();
                } else {
                    throw "Cant stop ad";
                }
            });
        },

        //#region dialog

        openDlgSettings: function() {
            this.stageNmb = 1;
            /*this.dlgSettings.open();*/
            this.getAdSettings();

        },

        openDlgImportNow: function() {
            this.stageNmb = 1;
            /*this.dlgSettings.open();*/
            /*$('#settingsDlg').show();
            */
            this.getAdSettings();
        },

        openDlgSync: function() {
            this.stageNmb = 1;
            /*this.dlgSettings.open();*/
            this.importNow();

        },

        closeDlgSettings: function() {
            var _self = this;
            this.settingDialog.hide();
            _self.scroller.update(true);
            if (this.adIsEnabled === true) {
                this.$pnlChangeSettingImport.show('slow');
                this.$changeSettingButtons().show();
                this.getSyncState();
            } else {
                this.$pnlAdIsEnabled.hide();
                this.$pnlAdIsDisabled.show();
            }
            /*this.dlgSettings.close();*/
        },

        //#endregion dialog

        //#region sync   

        startSync: function() {
            if (this.syncIntervalId === undefined) {
                this.syncIntervalId = setInterval(this.getSyncState.bind(this), 5000);
            }
            this.getSyncState();
            this.showSync();
        },

        stopSync: function(status) {
            if (this.syncIntervalId !== undefined) {
                clearInterval(this.syncIntervalId);
                this.syncIntervalId = undefined;
            }
            this.showSync(status);
        },

        syncComplete: function() {

        },

        showSync: function(status) {
            if (this.syncIntervalId !== undefined)//if sync is runing
            {
                $('#synchronizationError').hide();
                $('.adi-sync__complete').hide();
                $('.adi-sync__loading').fadeIn('slow');
                $('#importNowPanel').hide();
                $('#syncInProgress').show();

                $('#btnChangeSettingWraper').hide();
                $('#btnStopAndChangeSettingWraper').show();

            } else {
                if (status == -1) //an error
                {
                    $('.adi-sync__complete').hide();
                    $('.adi-sync__loading').hide();
                    $('#synchronizationError').fadeIn('slow');
                    $('#importNowPanel').show();
                    $('#lastImportDate').addClass('errorImportStatus');
                } else {
                    $('#synchronizationError').hide();
                    $('.adi-sync__loading').hide();
                    $('.adi-sync__complete').fadeIn('slow');
                    $('#importNowPanel').show();
                    $('#syncInProgress').hide();
                    $('#lastImportDate').addClass('adi-info__item_success');
                }
                $('#btnStopAndChangeSettingWraper').hide();
                $('#btnChangeSettingWraper').show();
            }
        },

        getSyncState: function() {
            var _self = this;
            Ajax.Settings.GetSyncState({
                ownHandler: true,
                success: function(res) {
                    if (res.data.Status == 0) {
                        if (!res.data.Error) {
                            $('#usrCount').html(res.data.UserCount);
                            if (_self.lastImportForm) {
                                _self.lastImportForm.lastForm.getElementByName("LastImportDate").setValue(res.data.Time);
                                _self.lastImportForm.lastForm.getElementByName("LastImportDate").refresh();
                            }
                            _self.stopSync();
                        } else {
                            $('#syncErrorText').html(Localizer.get('PROJECT.SETTINGS.ACTIVEDIRECTORYTAB.SYNCHASANERROR') + res.data.Error);
                            _self.stopSync(-1);
                        }
                        _self.syncIsCompleted = true;
                    } else {
                        _self.syncIsCompleted = false;
                        _self.syncIsCompleted = false;
                        //waiting..
                    }
                },
                error: function(res) {
                    //console.log2(res);
                    $('#syncErrorText').html(Localizer.get('PROJECT.SETTINGS.ACTIVEDIRECTORYTAB.SYNCHASANERROR') + res.data.Error);
                    _self.stopSync(-1);
                    _self.syncIsCompleted = true;
                }
            });
        },

        //#endregion sync

        //#region Buttons

        clickEnableAd: function() {
            this.$pnlAdIsDisabled.hide();
            this.$pnlAdIsEnabled.show();
            this.openDlgSettings();
            if (this.adIsEnabled)
                this.$pnlMainContent.addClass('adi_enable');
        },

        clickDisabledAd: function() {
            this.$pnlAdIsEnabled.hide();
            this.$pnlAdIsDisabled.show();
            this.adIsEnabled = false;
            this.$pnlChangeSettingImport.hide('slow');
            this.enableAdIntegration();
            this.settingDialog.hide('slow');
            this.$pnlMainContent.removeClass('adi_enable');
        }
        //#endregion 
    };
});
define([
    'cmwTemplate!app/settings/activedirectoryintegration/view/tpl/AdGroupList.html',
    'app/settings/activedirectoryintegration/AdIntegration'
]);

