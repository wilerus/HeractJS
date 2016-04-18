/**
 * Developer: Grigory Kuznetsov
 * Date: 7/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define(['form/App', 'form/templates/widgets/historyItem.html', 'form/templates/widgets/historyCollection.hbs'],
    function (App, HistoryItemTmpl, HistoryTmpl) {
        'use strict';

        var HistoryItemView = Marionette.CompositeView.extend({
            tagName: 'div',
            className: 'tab-list__i',
            template: Handlebars.compile(HistoryItemTmpl, {noEscape: true}),
            ui: {
                detailsContainer: '.js-details-container'
            },
            events: {
                'click': 'onDetailsExpanderClick'
            },
            mixinTemplateHelpers: function (data) {
                data.actionName = this.cmwEvents[data.eventGroup].getText();
                data.actionDate = App.DateFormatter.getFullDateTime(data.date);
                data.details = this.getDetails(data);
                return data;
            },

            getLetterDetails: function (data) {
                var details = [];

                _.each(data.changes, function (change) {
                    var detail = {};
                    detail.value = '';

                    if (change.predicate === 'cmw.history.event.letter.receiver') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.RECEIVER');
                        detail.value += change.newObjectRef[0].name;
                    } else if (change.predicate === 'cmw.history.event.letter.senderName') {
                        detail.predicateName =  App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.SENDER');
                        detail.value += change.newObjectRef[0].name;
                    } else if (change.predicate === 'cmw.history.event.letter.subject') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.SUBJECT');
                        detail.value += change.newObjectRef[0].name;
                    } else if (change.predicate === 'cmw.history.event.letter.body') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.BODY');
                        detail.value += '<br>';
                        detail.value += change.newObjectRef[0].name;
                    } else if (change.predicate === 'cmw.history.event.letter.attachment') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.ATTACHMENTS');

                        _.each(change.newObjectRef, function (item, i) {
                            i !== 0 && (detail.value += ',<br>');
                            detail.value += item.name;
                        });
                    }

                    details.push(detail);
                });

                return details;
            },

            getDetails: function (data) {
                var details = [],
                    self = this;
                if (data.eventGroup === 'cmw.history.event.letter') {
                    return this.getLetterDetails(data);
                }

                _.each(data.changes, function (change) {
                    var detail = {},
                        newArgs = [],
                        oldValue = [];

                    if (change.newObjectRef && change.newObjectRef.length) {
                        _.each(change.newObjectRef, function(item) {
                            if (change.predicateType === 'dateTime') {
                                newArgs.push(App.DateFormatter.getFullDateTime(item.name));
                            } else {
                                newArgs.push(item.name);
                            }
                        });
                        if (newArgs.length) {
                            detail.value = newArgs.toString();
                        }
                    } else {
                        detail.deleted = true;
                    }

                    if (change.oldObjectRef && change.oldObjectRef.length) {
                        _.each(change.oldObjectRef, function(item) {
                            if (change.predicateType === 'dateTime') {
                                oldValue.push(App.DateFormatter.getFullDateTime(item.name));
                            } else {
                                oldValue.push(item.name);
                            }
                        });
                        if (oldValue) {
                            detail.oldValue = oldValue.toString();
                        }
                    }

                    if (data.event === 'cmw.history.event.commentEdited' || data.event === 'cmw.history.event.commented') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.COMMENT');
                    } else if (data.event === 'cmw.history.event.webcall') {
                        var predicate = '';
                        switch (change.predicate) {
                            case 'cmw.history.event.webcall.result':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.RESULT');
                                break;
                            case 'cmw.history.event.webcall.address':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.ADDRESS');
                                break;
                            case 'cmw.history.event.webcall.method':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.METHOD');
                                break;
                            case 'cmw.history.event.webcall.ownerName':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.OWNERNAME');
                                break;
                            case 'cmw.history.event.webcall.ownerType':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.OWNERTYPE');
                                break;
                            case 'cmw.history.event.webcall.code':
                                predicate = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL.CODE');
                                break;
                            default:
                                break;
                        }
                        detail.predicateName = predicate;
                        newArgs && (detail.value = change.newObjectRef[0].name);
                    } else if (change.predicate === 'cmw.attachment.revision') {
                        detail.predicateName = App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.ATTACHMENTS');
                        oldValue && (detail.oldValue = self.getAttachmentText(change.oldObjectRef));
                        newArgs && (detail.value = self.getAttachmentText(change.newObjectRef));
                    } else {
                        detail.predicateName = change.predicateName;
                    }

                    details.push(detail);
                });
                return details;
            },

            getAttachmentText: function (items) {
                var txt = '',
                    l = items.length;

                _.each(items, function (item, i) {
                    var date;
                    if (item.date) {
                        date = App.DateFormatter.getFullDateTime(item.date);
                    }
                    if (item.file === App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.DELETED')) {
                        txt += App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.ATTACHMENTDELETED').replace('{revision}', date).replace('{id}', item.objectId);
                    } else {
                        txt += App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.ATTACHMENTEXIST').replace('{revision}', date).replace('{file}',
                                '<a href="/GetAttachment.ashx?id=' + item.objectId + '" class="history_attach">' + item.file + '</a>');
                    }
                    i < l - 1 && (txt += '<br>');
                });

                return txt;
            },

            onDetailsExpanderClick: function () {
                this.$el.toggleClass('tr-expanded');
                this.ui.detailsContainer.toggleClass('hidden');
            },

            cmwEvents: {
                'cmw.history.event.create': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.CREATED'); }
                },
                'cmw.history.event.edit': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.UPDATED'); }
                },
                'cmw.history.event.delete': {
                    getText: function () { return ''; }
                },
                'cmw.history.event.commented': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.ADDEDCOMMENT'); }
                },
                'cmw.history.event.commentEdited': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.EDITEDCOMMENT'); }
                },
                'cmw.history.event.workflowTransition': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.UPDATED'); }
                },
                'cmw.history.event.taskCompleted': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.COMPLETEDTASK'); }
                },
                'cmw.stateClosed': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.CHANGEDITEMSTATUS'); }
                },
                'cmw.history.event.letter': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.EMAILWASSENT'); }
                },
                'cmw.history.event.webcall': {
                    getText: function () { return App.Localizer.get('ELEGANCE.FORM.WIDGETS.HISTORY.WEBSERVICECALL'); }
                }
            }
        });

        return Marionette.CompositeView.extend({
            template: HistoryTmpl,
            childViewContainer: '.js-history-container',
            tagName: 'div',
            className: 'tab-list',
            childView: HistoryItemView
        });
    });
