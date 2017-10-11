/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define([
    './views/ModuleView',
    './views/NavigationView',
    './views/DemoContentView',
    './CasesConfig',
    'shared'
], function(
    ModuleView,
    NavigationView,
    DemoContentView,
    casesConfig,
    shared
) {
    'use strict';

    return Core.Controller.extend({
        contentViewOptions: function () {
            return {
                collection: new Backbone.Collection(_.map(casesConfig.sections, function (section) {
                    var group = this.__findDefaultGroup(section.id);
                    var url = shared.services.ModuleService.getModuleUrlByName('case', shared.services.ModuleService.modules.DEMO_CORE, {
                        section: section.id,
                        group: group.id,
                        case: group.cases ? group.cases[0].id : 'default'
                    });
                    return _.extend({
                        url: url
                    }, section);
                }, this))
            };
        },

        contentView: DemoContentView,

        navigate: function () {
            this.view.setNavigationVisibility(false);
            this.moduleRegion.show(new NavigationView({
                collection: this.view.collection
            }));
        },

        navigateToCase: function (sectionId, groupId, caseId) {
            this.view.setNavigationVisibility(true);
            this.moduleRegion.show(new ModuleView({
                activeSectionId: sectionId,
                activeGroupId: groupId,
                activeCaseId: caseId
            }));
        },

        __findDefaultGroup: function (sectionId) {
            var section = _.find(casesConfig.sections, function(section) {
                return sectionId.toLowerCase() === section.id.toLowerCase();
            });
            var defaultGroupId = section.groups[0].id;
            return _.find(section.groups, function(group) {
                return defaultGroupId.toLowerCase() === group.id.toLowerCase();
            });
        }
    });
});
