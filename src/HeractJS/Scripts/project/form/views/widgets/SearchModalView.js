/**
 * Developer: Grigory Kuznetsov
 * Date: 11/12/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, $ */

define(['form/App', 'form/templates/widgets/searchContainer.html',
        'form/models/editors/account/AccountModel', 'form/templates/editors/account/accountItem.html',
        'form/templates/editors/instance/instanceItem.html'],
    function (App, searchContainerTmpl, AccountModel, AccountItemTmpl, instanceItemTmpl) {
        'use strict';

        var SearchListView = Marionette.ItemView.extend({
            initialize: function (opts) {
                this.data = opts.data;
                this.type = opts.type;

                this.setTemplate();
            },
            setTemplate: function () {
                var template = instanceItemTmpl;
                if (this.type === 'user') {
                    template = AccountItemTmpl;
                }

                this.template = Handlebars.compile(template);
            },
            mixinTemplateHelpers: function () {
                return this.data;
            },

            onClick: function (e) {
                var selectedId = $(e.currentTarget).data('id'),
                    selectedData = _.find(this.data, function (i) {
                        return i.id == selectedId;
                    });
                this.trigger('itemSelected', selectedData);
            },
            onRender: function () {
                this.$el.find('.js-list-item').on('click', this.onClick.bind(this));
            }
        });

        return Marionette.ItemView.extend({
            initialize: function (options) {
                this.type = options.type;
                this.listModel = options.listModel;
                this.template = Handlebars.compile(searchContainerTmpl);

                this.searchListView = new SearchListView({data: this.listModel.data, type: this.type});
                this.listenTo(this.searchListView, 'itemSelected', this.itemSelected, this);
                this.prevFilterValue = '';
                this.initializeEventsHandling();
            },
            template: Handlebars.compile(searchContainerTmpl),
            className: 'wmodal wmodal_search',
            events: {
                'click #select-header-back': 'triggerBack',
                'search @ui.searchInput': 'filterCollection',
                'keyup @ui.searchInput': '__handleInputChange',
                'blur @ui.searchInput': 'filterCollection'
            },

            mixinTemplateHelpers: function (data) {
                if (this.type === 'user') {
                    data.containerClass = 'assignee-list';
                    data.title = App.Localizer.get('ELEGANCE.FORM.WIDGETS.ACCOUNTSELECT.SEARCHTITLE');
                } else {
                    data.containerClass = 'list';
                    data.title = App.Localizer.get('ELEGANCE.FORM.WIDGETS.INSTANCESELECT.TITLE');
                }

                var maxHeight = 100;
                data.maxHeight = maxHeight;
                data.isMobile = App.StateManager.isMobile;
                return data;
            },
            ui: {
                searchInput: '#search-list',
                searchResultContainer: '#search-results-container'
            },
            initializeEventsHandling: function () {
                this.listenTo(this.listModel, 'dataLoaded', function () {
                    this.searchListView.data = this.listModel.data;
                }.bind(this));
            },
            onRender: function () {
                this.$el.addClass(this.className);
                this.renderUserList();
            },
            renderUserList: function () {
                this.searchListView.data = this.listModel.data;
                this.ui.searchResultContainer.html(this.searchListView.render().$el.children());
            },
            filterCollection: function () {
                var filter = this.ui.searchInput.val();
                if (filter == this.prevFilterValue) {
                    return;
                }

                this.prevFilterValue = filter;
                if (filter === '') {
                    this.resetFilter();
                } else {
                    this.filterData(filter);
                }
            },
            triggerBack: function () {
                this.trigger('triggerBack');
                this.remove();
            },
            itemSelected: function (selectedData) {
                this.trigger('itemSelected', selectedData);
                this.remove();
            },
            __handleInputChange: function (e) {
                if (e.keyCode == 13) {
                    this.ui.searchInput.blur();
                }
            },
            resetFilter: function () {
                this.filterData('');
            },
            filterData: function (filter) {
                this.listenTo(this.listModel, 'dataLoaded', this.renderUserList);
                this.listModel.getFilteredData(filter);
            }
        });
    });
