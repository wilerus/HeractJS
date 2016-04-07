/**
 * Developer: Roman Shumskiy
 * Date: 12/11/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, $ */

define(['../../../App', './SelectOption', '../../ConfirmView'],
    function (App, SelectOption, ConfirmView) {
        'use strict';
        return Marionette.ItemView.extend({
            initialize: function (options) {
                this.attachmentsCollection = options.attacmentsCollection;
                _.bindAll(this, "template");
            },

            ui: {
                input: '.js-add-file'
            },

            events: {
                'change .js-add-file': 'fileSelected',
                'submit .js-add-file': 'onSubmit'
            },

            template: Handlebars.compile('<input class="input-file js-add-file" type="file">'),
            className: 'icon icon_attach icon-add',

            fileSelected: function () {
                var fileApi = (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;
                if (fileApi && this.ui.input[0].files[0]) {
                    this.fileName = this.ui.input[0].files[0].name;
                    if (this.attachmentsCollection && this.attachmentsCollection.length) {
                        var attachmentsL = this.attachmentsCollection.length;
                        for (var i = 0; i < attachmentsL; i++) {
                            if (this.fileName === this.attachmentsCollection[i].name) {
                                if(this.attachmentsCollection[i].id){
                                    this.onAttachmentDuplicate(this.attachmentsCollection[i].id);
                                    return;
                                }
                            }
                        }
                    }
                    this.mode = 'create';
                    this.ui.input.submit();
                }
            },

            afterSubmit: function (fileName, response) {
                var dataObj = {},
                    streamId = JSON.parse(response).fileId;

                if((App.StateManager.state.isEdit || App.StateManager.state.isCreate) && this.mode != 'update'){
                    App.FormMediator.saveTemporaryAttachment({
                        date: new Date().toISOString(),
                        name: fileName,
                        streamId: streamId
                    });
                    App.StateManager.forceRefresh(false, false, 'refresh');
                    return;
                }

                if (this.mode == 'create') {
                    dataObj = {
                        itemId: App.StateManager.state.form,
                        fileName: this.fileName
                    };
                    App.API.post('/EleganceAttachment/Create', dataObj).done(function (resp) {
                        this.afterCreate(streamId, resp.data);
                    }.bind(this));
                } else if (this.mode == 'update') {
                    dataObj = {
                        itemId: App.StateManager.state.form,
                        fileName: this.fileName,
                        attachmentId: this.duplicateAttachmentId,
                        streamId: streamId
                    };
                    App.API.post('/EleganceAttachment/Update', dataObj).done(function () {
                        App.StateManager.forceRefresh(false, false, 'refresh');
                    });
                }
            },

            afterCreate: function (streamId, attachmentId) {
                var data = {
                    id: App.StateManager.state.form,
                    attachmentId: attachmentId,
                    streamId: streamId,
                    fileName: this.fileName
                };
                App.API.post('/EleganceAttachment/SetData', data).done(function (resp) {
                    if(resp.success){
                        App.StateManager.forceRefresh(false, false, 'refresh');
                    }
                });
            },

            onAttachmentDuplicate: function (id) {
                this.duplicateAttachmentId = id;

                this.confirmView = new ConfirmView({
                    title: App.Localizer.get('ELEGANCE.FORM.CONFIRM.ATTACHMENTS.UPDATE'),
                    text: App.Localizer.get('ELEGANCE.FORM.CONFIRM.ATTACHMENTS.UPDATE.MSG'),
                    textOk: App.Localizer.get('ELEGANCE.FORM.CONFIRM.YES'),
                    textCancel: App.Localizer.get('ELEGANCE.FORM.CONFIRM.NO'),
                    className: 'wmodal wmodal_confirm'
                });

                this.listenTo(this.confirmView, 'triggerOk', function(){
                    this.mode = 'update';
                    this.ui.input.submit();
                    App.FormMediator.hideCustomPopupView();
                }.bind(this));

                this.listenTo(this.confirmView, 'triggerCancel', function(){
                    App.FormMediator.hideCustomPopupView();
                    this.ui.input.val("");
                }.bind(this));

                App.FormMediator.showCustomPopupView(this.confirmView);
            },

            onSubmit: function (event) {
                event.stopPropagation();
                event.preventDefault();

                var formData = new FormData(),
                    self = this;

                formData.append("file" + (0 + 1), event.target.files[0]);
                $.ajax({
                    url: '/UploadAttachment.ashx',
                    data: formData,
                    processData: false,
                    type: 'POST',
                    contentType: false,
                    encoding: 'multipart/form-data',
                    enctype: 'multipart/form-data',
                    mimeType: 'multipart/form-data',
                    success: function (response) {
                        self.afterSubmit(self.fileName, response);
                    },
                    failure: function () {
                        self.failureSubmit();
                    }
                });
            },

            processIOSFile: function(){
                var attachmentsL = this.attachmentsCollection.length;
                var lastPeriodIndex = this.fileName.lastIndexOf('.');
                var nameWithoutExtension = this.fileName.substring(0, lastPeriodIndex);
                var number = 0;
                for (var j = 0; j < attachmentsL; j++) {
                    if (this.attachmentsCollection[j].name.indexOf(nameWithoutExtension) > -1) {
                        number++;
                    }
                }
                if (number) {
                    this.fileName = this.fileName.substring(0, lastPeriodIndex) + ' (' + number + ')' + this.fileName.substring(lastPeriodIndex);
                }
            }
        });
    });
