/**
 * Developer: Grigory Kuznetsov
 * Date: 31/10/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _ */

define([],
    function () {
        'use strict';

        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    // ближайший аналог внутренней функции
                    // IsCallable в ECMAScript 5
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () { },
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis
                               ? this
                               : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();

                return fBound;
            };
        }

        var CollectionModel = Backbone.Model.extend({
            initialize: function (cfg) {
               _.extend(this, cfg);

                var children = this.get('children');
                this.children = new CommentsCollection(children);
                this.unset('children');
            },
            add: function () {
                var id = this.get('parentId') || this.get('id'),
                    value = this.get('value');

                App.API.post('/EleganceDiscussion/AddComment', {parentId: id, value: value}).done(function () {
                    var children = this.get('children');
                    this.children = new CommentsCollection(children);
                    App.FormMediator.onCommentsChange();
                }.bind(this));
            },
            save: function () {
                var id = this.get('id'),
                    value = this.get('value');

                App.API.post('/EleganceDiscussion/EditComment', {commentId: id, value: value}).done(function () {
                    App.FormMediator.onCommentsChange();
                });
            }
        });

        var CommentsCollection = Backbone.Collection.extend({
            model: CollectionModel,
            urlRoot: "/EleganceDiscussion/GetComments?id=",

            initialize: function () {
                this.on('reset', function() {
                    this.getCommentsCnt();
                }.bind(this));
            },

            getComments: function (id) {
                this.url = this.urlRoot + id;
                this.fetch({
                    reset: true,
                    success: this.onDataLoaded.bind(this)
                });
            },

            comparator: function (model) {
                return new Date(model.get('date'));
            },

            getCommentsCnt: function model(rootModel) {
                var commentsCnt = 0;
                var root = rootModel || this.models[0];
                if (!root || root.children.length === 0) {
                    return commentsCnt;
                }

                root.children.each(function (model) {
                    commentsCnt++;
                    model.children && (commentsCnt += this.getCommentsCnt(model));
                }.bind(this));

                root.set('childCnt', commentsCnt);

                return commentsCnt;
            },

            onDataLoaded: function () {
                this.getCommentsCnt();
                this.trigger('commentsLoaded');
            },

            parse: function (resp) {
                return resp.data;
            }
        });

        return CommentsCollection;
    });
