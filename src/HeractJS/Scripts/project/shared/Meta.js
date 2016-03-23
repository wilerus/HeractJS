/**
 * Developer: Stepan Burguchev
 * Date: 2/3/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

define(['coreui'],
    function (core) {
        'use strict';

        var componentTypes = {
            VERTICAL_LAYOUT: 'VerticalLayout',
            COLUMN_LAYOUT: 'ColumnLayout',
            HORIZONTAL_LAYOUT: 'HorizontalLayout',
            GROUP_PANEL: 'GroupPanel',
            TAB_LAYOUT: 'TabLayout',
            TAB_PANEL: 'TabPanel',
            STATIC_CONTENT: 'StaticContent',
            FIELD_COMPONENT: 'FieldComponent',
            ACTION_BUTTON: 'ActionButton',
            SEPARATOR: 'Separator',
            FORM: 'SubForm'
        };

        var fieldTypes = {
            TEXT: 'Text',
            DATE: 'Date',
            DURATION: 'Duration',
            NUMBER: 'Number',
            BOOLEAN: 'Boolean',
            MEMBER: 'Member',
            DOCUMENT: 'Document',
            REFERENCE: 'Reference',
            COLLECTION: 'Table',
            USER_DEFINED: 'UserDefined'
        };

        var textEditorTypes = {
            SIMPLE: 'Simple',
            MULTILINE: 'Multiline'
        };

        var multiLineEditor = {
            maxRows: 15,
            minRows: 3
        };

        var booleanEditorTypes = {
            RADIO: 'Radio',
            CHECKBOX: 'Checkbox'
        };

        var convertToClientDataType = function (serverType) {
            var clientType,
                objectPropertyTypes = core.meta.objectPropertyTypes;

            switch (serverType) {
            case 'String':
                clientType = objectPropertyTypes.STRING;
                break;
            case 'InstanceProperty':
                clientType = objectPropertyTypes.INSTANCE;
                break;
            case 'AccountProperty':
                clientType = objectPropertyTypes.ACCOUNT;
                break;
            case 'EnumProperty':
                clientType = objectPropertyTypes.ENUM;
                break;
            case 'Integer':
                clientType = objectPropertyTypes.INTEGER;
                break;
            case 'Double':
                clientType = objectPropertyTypes.DOUBLE;
                break;
            case 'Decimal':
                clientType = objectPropertyTypes.DECIMAL;
                break;
            case 'Duration':
                clientType = objectPropertyTypes.DURATION;
                break;
            case 'Boolean':
                clientType = objectPropertyTypes.BOOLEAN;
                break;
            case 'DateTime':
                clientType = objectPropertyTypes.DATETIME;
                break;
            case 'DocumentProperty':
                clientType = objectPropertyTypes.DOCUMENT;
                break;
            default:
                clientType = serverType;
                break;
            }

            return clientType;
        };

        return {
            component: {
                types: componentTypes,
                fieldTypes: fieldTypes
            },
            convertToClientDataType: convertToClientDataType,
            editorTypes: {
                textEditorTypes: textEditorTypes,
                booleanEditorTypes: booleanEditorTypes
            },
            multiLineEditor: multiLineEditor
        };
    });
