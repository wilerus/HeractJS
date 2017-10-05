/**
 * Developer: Stepan Burguchev
 * Date: 07/27/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define([
    './cases/editors/TextEditor/default',
    'text-loader!./cases/editors/TextEditor/default.js',

    './cases/editors/TextAreaEditor/default',
    'text-loader!./cases/editors/TextAreaEditor/default.js',

    './cases/editors/BooleanEditor/default',
    'text-loader!./cases/editors/BooleanEditor/default.js',

    './cases/editors/NumberEditor/default',
    'text-loader!./cases/editors/NumberEditor/default.js',

    './cases/editors/DateEditor',
    'text-loader!./cases/editors/DateEditor.js',

    './cases/editors/TimeEditor',
    'text-loader!./cases/editors/TimeEditor.js',

    './cases/editors/DateTimeEditor',
    'text-loader!./cases/editors/DateTimeEditor.js',

    './cases/editors/DurationEditor/default',
    'text-loader!./cases/editors/DurationEditor/default.js',

    './cases/editors/DropdownEditor/default',
    'text-loader!./cases/editors/DropdownEditor/default.js',

    './cases/editors/ReferenceEditor/default',
    'text-loader!./cases/editors/ReferenceEditor/default.js',

    './cases/editors/ReferenceEditorWithAddNewButton',
    'text-loader!./cases/editors/ReferenceEditorWithAddNewButton.js',

    './cases/editors/RadioGroupEditor/default',
    'text-loader!./cases/editors/RadioGroupEditor/default.js',

    './cases/editors/MemberSelectEditor/default',
    'text-loader!./cases/editors/MemberSelectEditor/default.js',

    './cases/editors/MembersBubbleEditor/default',
    'text-loader!./cases/editors/MembersBubbleEditor/default.js',

    './cases/editors/MentionEditor',
    'text-loader!./cases/editors/MentionEditor.js',

    './cases/editors/MultiSelectEditor',
    'text-loader!./cases/editors/MultiSelectEditor.js',

    './cases/editors/MaskedTextEditor',
    'text-loader!./cases/editors/MaskedTextEditor.js',
    
    './cases/editors/AvatarEditor',
    'text-loader!./cases/editors/AvatarEditor.js',

    './cases/editors/PasswordEditor',
    'text-loader!./cases/editors/PasswordEditor.js',

    './cases/editors/Form',
    'text-loader!./cases/editors/Form.js',

    './cases/dropdown/actionMenu',
    'text-loader!./cases/dropdown/actionMenu.js',

    './cases/dropdown/popoutCustomization',
    'text-loader!./cases/dropdown/popoutCustomization.js',

    './cases/dropdown/popoutCustomAnchor',
    'text-loader!./cases/dropdown/popoutCustomAnchor.js',

    './cases/dropdown/popoutDialog',
    'text-loader!./cases/dropdown/popoutDialog.js',

    './cases/dropdown/dropdownCustomization',
    'text-loader!./cases/dropdown/dropdownCustomization.js',

    './cases/dropdown/dropdownPanelPosition',
    'text-loader!./cases/dropdown/dropdownPanelPosition.js',

    './cases/list/listBasicUsage',
    'text-loader!./cases/list/listBasicUsage.js',

    './cases/list/listSearchHighlight',
    'text-loader!./cases/list/listSearchHighlight.js',

    './cases/list/listGroupBy',
    'text-loader!./cases/list/listGroupBy.js',

    './cases/list/grid',
    'text-loader!./cases/list/grid.js',

    './cases/list/gridHeightAuto',
    'text-loader!./cases/list/gridHeightAuto.js',

    './cases/list/gridSearchHighlight',
    'text-loader!./cases/list/gridSearchHighlight.js',

    './cases/list/nativeGrid',
    'text-loader!./cases/list/nativeGrid.js',

    './cases/other/splitPanel',
    'text-loader!./cases/other/splitPanel.js',

    './cases/other/messageService',
    'text-loader!./cases/other/messageService.js',

    './cases/other/windowsService',
    'text-loader!./cases/other/windowsService.js',

    './cases/other/localizationService',
    'text-loader!./cases/other/localizationService.js',

    './cases/other/loadingBehavior',
    'text-loader!./cases/other/loadingBehavior.js'
], function () {
    "use strict";

    /**
     * Case path is gonna be like: core/demo/cases/{sectionId}/{groupId}/{caseId}.js
     */
    return {
        sections: [
            {
                id: 'editors',
                displayName: 'Editors',
                groups: [
                    {
                        id: 'BooleanEditor',
                        displayName: 'Boolean Editor',
                        description: 'test',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'DateEditor',
                        displayName: 'Date Editor'
                    },
                    {
                        id: 'DateTimeEditor',
                        displayName: 'DateTime Editor'
                    },
                    {
                        id: 'DropdownEditor',
                        displayName: 'Dropdown Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'DurationEditor',
                        displayName: 'Duration Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'MaskedTextEditor',
                        displayName: 'Masked Text Editor'
                    },
                    {
                        id: 'MemberSelectEditor',
                        displayName: 'Member Select Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'MembersBubbleEditor',
                        displayName: 'Members Bubble Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'MentionEditor',
                        displayName: 'Mention Editor'
                    },
                    {
                        id: 'MultiSelectEditor',
                        displayName: 'MultiSelect Editor'
                    },
                    {
                        id: 'AvatarEditor',
                        displayName: 'Avatar Editor'
                    },
                    {
                        id: 'NumberEditor',
                        displayName: 'Number Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'PasswordEditor',
                        displayName: 'Password Editor'
                    },
                    {
                        id: 'RadioGroupEditor',
                        displayName: 'Radio Group Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'ReferenceEditor',
                        displayName: 'Reference Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'ReferenceEditorWithAddNewButton',
                        displayName: 'Reference Editor (Add new button)'
                    },
                    {
                        id: 'TextAreaEditor',
                        displayName: 'Text Area Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'TextEditor',
                        displayName: 'Text Editor',
                        cases: [
                            {
                                id: 'default',
                                displayName: 'Default'
                            }
                        ]
                    },
                    {
                        id: 'TimeEditor',
                        displayName: 'Time Editor'
                    },
                    {
                        id: 'Form',
                        displayName: 'Form'
                    }
                ]
            },
            {
                id: 'dropdown',
                displayName: 'Dropdown & Popout',
                groups: [
                    {
                        id: 'actionMenu',
                        displayName: 'Action Menu',
                        description: 'Для создания простого меню с командами мы используем метод core.dropdown.factory.createMenu из фабрики дропдаунов.' +
                        '\r\n\r\n' +
                        'Метод возвращает обычный PopoutView, настроенный для отображения меню.'
                    },
                    {
                        id: 'popoutCustomization',
                        displayName: 'Popout (Custom Views)',
                        description: ''
                    },
                    {
                        id: 'popoutCustomAnchor',
                        displayName: 'Popout (Custom Anchor)',
                        description: ''
                    },
                    {
                        id: 'popoutDialog',
                        displayName: 'Popout (Dialog)',
                        description: ''
                    },
                    {
                        id: 'dropdownCustomization',
                        displayName: 'Dropdown (Customization)',
                        description: ''
                    },
                    {
                        id: 'dropdownPanelPosition',
                        displayName: 'Dropdown (Panel Position)',
                        description: ''
                    }
                ]
            },
            {
                id: 'list',
                displayName: 'List & Grid',
                groups: [
                    {
                        id: 'listBasicUsage',
                        displayName: 'List (Basic Usage)'
                    },
                    {
                        id: 'listSearchHighlight',
                        displayName: 'List (Search & Highlight)'
                    },
                    {
                        id: 'listGroupBy',
                        displayName: 'List (Group By)'
                    },
                    {
                        id: 'grid',
                        displayName: 'Grid'
                    },
                    {
                        id: 'gridHeightAuto',
                        displayName: 'Grid (Height: Auto)'
                    },
                    {
                        id: 'gridSearchHighlight',
                        displayName: 'Grid (Search & Highlight)'
                    },
                    {
                        id: 'nativeGrid',
                        displayName: 'Grid (With native scroll)'
                    }

                ]
            },
            {
                id: 'other',
                displayName: 'Other stuff',
                groups: [
                    {
                        id: 'splitPanel',
                        displayName: 'Split Panel',
                        description: 'Panels are resizable, drag the splitter!'
                    },
                    {
                        id: 'messageService',
                        displayName: 'Message Service'
                    },
                    {
                        id: 'windowsService',
                        displayName: 'Windows Service'
                    },
                    {
                        id: 'localizationService',
                        displayName: 'Localization Service'
                    },
                    {
                        id: 'loadingBehavior',
                        displayName: 'Loading Behavior'
                    }
                ]
            }
        ]
    };
});
