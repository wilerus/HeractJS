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

import shared from 'modules/shared';
import EventCenterService from 'services/EventCenterService';
import Notifications from 'modules/notifications';
import template from '../templates/content.html';
import SelectableCollection from 'modules/shared/collections/SelectableCollection';
import RoutingService from 'services/RoutingService';

const classes = {
    TABS_CONTAINER_WITH_BACK: 'top-nav-back'
};

const NotificationsButtonView = Notifications.NotificationsButtonView;
const NotificationsPanelView = Notifications.NotificationsPanelView;

export default Marionette.LayoutView.extend({
    initialize() {
        this.model = new Backbone.Model();
        this.model.set('listsMenuButtonModel', new Backbone.Model());
        this.model.set('listsMenuCollection', new Backbone.Collection());
        this.model.set('headerTabs', new SelectableCollection());
        this.listSelectionMenu = this.__createListSelectionMenu();
        this.listenTo(this.listSelectionMenu, 'execute', datasetId => {
            this.trigger('contentView:select:list', datasetId);
        });
    },

    template: Handlebars.compile(template),

    className: 'content-view',

    ui: {
        backButton: '.js-back-button',
        backButtonText: '.js-back-button-text',
        headerTabsContainer: '.js-header-tabs-container',
        containerTitle: '.js-container-title',
        administrationButton: '.js-administration-button'
    },

    events: {
        'click @ui.backButton': '__back',
        'click @ui.administrationButton': '__navigateToAdministration'
    },

    regions: {
        listSelectionMenuRegion: '.js-list-selection-menu-region',
        moduleRegion: '.js-module-region',
        moduleLoadingRegion: '.js-module-loading-region',
        profileRegion: '.js-profile-region',
        notificationsRegion: '.js-notifications-region',
        eventCenterRegion: '.js-event-center-region'
    },

    behaviors: {
        ContentViewBehavior: {
            behaviorClass: shared.application.views.behaviors.ContentViewBehavior,
            profileRegion: 'profileRegion',
            moduleLoadingRegion: 'moduleLoadingRegion'
        }
    },

    onRender() {
        this.hideBackButton();
        this.ui.headerTabsContainer.hide();
        this.ui.administrationButton.hide();
        this.listSelectionMenuRegion.show(this.listSelectionMenu);
    },

    onShow() {
        this.notificationsRegion.show(Core.dropdown.factory.createPopout({
            customAnchor: true,
            buttonView: NotificationsButtonView,
            panelView: NotificationsPanelView
        }));
        this.eventCenterRegion.show(EventCenterService.getEventCenterView());
    },

    setHeaderTabs(tabs, currentTabId) {
        if (tabs.length > 0) {
            this.model.get('headerTabs').reset(tabs);
            this.ui.headerTabsContainer.show();
            this.__updateAdministrationButton(tabs, currentTabId);
        }
    },

    __updateAdministrationButton(tabs, currentTabId) {
        this.ui.administrationButton.hide();
        if (tabs.length === 0) {
            return;
        }
        const tempTabs = _.clone(tabs);
        if (currentTabId) {
            const currentTabIndex = tempTabs.indexOf(_.find(tempTabs, tab => tab.id === currentTabId));
            if (currentTabIndex > -1) {
                tempTabs.splice(currentTabIndex, 1);
            }
        }
        const systemTab = _.find(tempTabs, tab => tab.type === 'system');
        if (systemTab && tempTabs.length > 1) {
            this.model.set('systemUrl', systemTab.url);
            this.ui.administrationButton.show();
        }
    },

    showBackButton(options) {
        this.backButtonOptions = options;
        if (options.name) {
            this.ui.backButtonText.text(options.name);
        }
        this.ui.backButton.show();
        this.ui.headerTabsContainer.addClass(classes.TABS_CONTAINER_WITH_BACK);
    },

    hideBackButton() {
        this.ui.backButton.hide();
        this.ui.headerTabsContainer.removeClass(classes.TABS_CONTAINER_WITH_BACK);
    },

    selectHeaderTab(tabId) {
        const tabModel = this.findTabModel(tabId);
        if (!tabModel) {
            Core.utils.helpers.throwError(`Failed to find a tab item with id \`${tabId}\``);
        }
        tabModel.select();
    },

    findTabModel(tabId) {
        return this.model.get('headerTabs').findWhere({ id: tabId }) || null;
    },

    updateListsMenu(newListsCollection, listName) {
        this.model.get('listsMenuCollection').reset(newListsCollection.models);
        this.model.get('listsMenuButtonModel').set('text', listName);
    },

    renameListsMenu(name, datasetId) {
        const dataset = this.model.get('listsMenuCollection').get(datasetId);
        if (dataset) {
            dataset.set('name', name);
            this.model.get('listsMenuButtonModel').set('text', name);
        }
    },

    setContainerTitle(containerTitle) {
        this.ui.containerTitle.text(containerTitle);
        this.ui.headerTabsContainer.show();
    },

    __back() {
        RoutingService.navigateToUrl(this.backButtonOptions.url);
    },

    __createListSelectionMenu() {
        return Core.dropdown.factory.createMenu({
            items: this.model.get('listsMenuCollection'),
            buttonModel: this.model.get('listsMenuButtonModel')
        });
    },

    __navigateToAdministration() {
        if (this.model.has('systemUrl')) {
            RoutingService.navigateToUrl(this.model.get('systemUrl'));
        }
    }
});
