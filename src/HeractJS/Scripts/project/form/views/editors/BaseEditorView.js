/**
 * Developer: Stepan Burguchev
 * Date: 10/3/2014
 * Copyright: 2010-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, _, Marionette, Backbone */

/*
 * This class is fully compatible with Backbone.Form.editors.Base and should be used to create Marionette-based editors for Backbone.Form
 * */

define(['form/App'],
    function (App) {
        'use strict';

        var onFocus = function () {
            this.trigger('focus', this);
        };

        var onBlur = function () {
            this.trigger('blur', this);
        };

        var onRender = function () {
            this.$el.attr('id', this.id);
            this.$el.attr('name', this.getName());
            //noinspection JSUnresolvedVariable
            if (this.schema.editorClass) {
                //noinspection JSUnresolvedVariable
                this.$el.addClass(this.schema.editorClass);
            }
            if (this.schema.editorAttrs) {
                this.$el.attr(this.schema.editorAttrs);
            }
            this.setValue(this.value, true, true); //silent set value onRender
            if (this.focusElement) {
                this.$el.on('focus', this.focusElement, onFocus.bind(this));
                this.$el.on('blur', this.focusElement, onBlur.bind(this));
            } else {
                this.$el.on('focus', onFocus.bind(this));
                this.$el.on('blur', onBlur.bind(this));
            }
        };

        return Marionette.ItemView.extend({
            defaultValue: null,

            hasFocus: false,

            constructor: function (options) {
                options = options || {};

                this.placeholders = {
                    readonly: App.Localizer.get('ELEGANCE.FORM.FIELDPLACEHOLDERS.READONLY'),
                    disabled: App.Localizer.get('ELEGANCE.FORM.FIELDPLACEHOLDERS.HIDDEN'),
                    empty: App.Localizer.get('ELEGANCE.FORM.FIELDPLACEHOLDERS.EMPTY'),
                    dateEmpty: App.Localizer.get('ELEGANCE.FORM.FIELDPLACEHOLDERS.DATEEMPTY'),
                    timeEmpty: App.Localizer.get('ELEGANCE.FORM.FIELDPLACEHOLDERS.TIMEEMPTY')
                };

                //Set initial value
                if (options.model) {
                    if (!options.key) {
                        throw new Error("Missing option: 'key'");
                    }

                    this.model = options.model;
                    this.value = this.model.get(options.key);
                }
                else if (options.value !== undefined) {
                    this.value = options.value;
                }

                if (this.value === undefined) {
                    this.value = this.defaultValue;
                }

                //Store important data
                _.extend(this, _.pick(options, 'key', 'form'));

                var schema = this.schema = options.schema || {};

                this.validators = options.validators || schema.validators;

                this.on('render', onRender.bind(this));
                if (options.autocommit) {
                    this.on('change', this.commit.bind(this));
                }

                Marionette.ItemView.prototype.constructor.apply(this, arguments);
                Backbone.Form.editors.Base.prototype.initialize.call(this, options);

                if (this.value.attributes.Calculated || this.value.attributes.ReadOnly || this.value.attributes.Static || this.value.access === 'Readonly' || this.value.access === 'Static' || this.value.access === 'Hidden')
                    this.isEditable = false;
                else
                    this.isEditable = true;

                this.bindModelEvents();
            },

            bindModelEvents: function() {
                var self = this,
                    eventName = 'change:' + this.key;
                this.model.on(eventName, function (val) {
                    self.setValue(val, true);
                });
            },

            __getFocusElement: function () {
                if (this.focusElement) {
                    return this.$el.find(this.focusElement);
                } else {
                    return this.$el;
                }
            },

            __triggerChange: function () {
                this.unSetValidationError();
                !this.value.isMultivalue && this.refreshForm();
                this.trigger('change', this);
            },

            /**
             * Get the value for the form input 'name' attribute
             *
             * @return {String}
             *
             * @api private
             */
            getName: function () {
                var key = this.key || '';

                //Replace periods with underscores (e.g. for when using paths)
                return key.replace(/\./g, '_');
            },

            /**
             * Get editor value
             * Extend and override this method to reflect changes in the DOM
             *
             * @return {Mixed}
             */
            getValue: function () {
                return this.value;
            },

            /**
             * Set editor value
             * Extend and override this method to reflect changes in the DOM
             *
             * @param {Mixed} value
             */
            setValue: function (value) {
                this.value = value;
            },

            /**
             * Give the editor focus
             * Extend and override this method
             */
            focus: function () {
                if (this.hasFocus) {
                    return;
                }
                this.__getFocusElement().focus();
            },

            /**
             * Remove focus from the editor
             * Extend and override this method
             */
            blur: function () {
                if (!this.hasFocus) {
                    return;
                }
                this.__getFocusElement().blur();
            },

            /**
             * Update the model with the current value
             *
             * @param {Object} [options]              Options to pass to model.set()
             * @param {Boolean} [options.validate]    Set to true to trigger built-in model validation
             *
             * @return {Mixed} error
             */
            commit: function (options) {
                var error = this.validate();
                if (error) {
                    return error;
                }

                this.listenTo(this.model, 'invalid', function (model, e) {
                    error = e;
                });
                this.model.set(this.key, this.getValue(), options);

                if (error) {
                    return error;
                }
            },

            /**
             * Check validity
             *
             * @return {Object|Undefined}
             */
            validate: function () {
                var error = null,
                    value = this.getValue(),
                    formValues = this.form ? this.form.getValue() : {},
                    validators = this.validators,
                    getValidator = this.getValidator;

                if (validators) {
                    //Run through validators until an error is found
                    _.every(validators, function (validator) {
                        error = getValidator(validator)(value, formValues);

                        return error ? false : true;
                    });
                }

                return error;
            },

            /**
             * Set this.hasFocus, or call parent trigger()
             *
             * @param {String} event
             */
            trigger: function (event) {
                if (event === 'focus') {
                    this.hasFocus = true;
                }
                else if (event === 'blur') {
                    this.hasFocus = false;
                }

                return Marionette.ItemView.prototype.trigger.apply(this, arguments);
            },

            /**
             * Returns a validation function based on the type defined in the schema
             *
             * @param {RegExp|String|Function} validator
             * @return {Function}
             */
            getValidator: function (validator) {
                var validators = Backbone.Form.validators;

                //Convert regular expressions to validators
                if (_.isRegExp(validator)) {
                    return validators.regexp({regexp: validator});
                }

                //Use a built-in validator if given a string
                if (_.isString(validator)) {
                    if (!validators[validator]) {
                        throw new Error('Validator "' + validator + '" not found');
                    }

                    return validators[validator]();
                }

                //Functions can be used directly
                if (_.isFunction(validator)) {
                    return validator;
                }

                //Use a customised built-in validator if given an object
                //noinspection JSUnresolvedVariable
                if (_.isObject(validator) && validator.type) {
                    var config = validator;

                    //noinspection JSUnresolvedVariable
                    return validators[config.type](config);
                }

                //Unknown validator type
                throw new Error('Invalid validator: ' + validator);
            },

            setPlaceholder: function (data) {
                if (this.value.access === 'Readonly' || this.value.access === 'Static') {
                    data.isEditable = false;
                    data.isPlaceholder = true;
                    data.prompt = this.value.data && this.value.data[0].instanceName ? this.value.data[0].instanceName : this.placeholders.readonly;
                } else if (this.value.access === 'Hidden') {
                    data.isEditable = false;
                    data.prompt = this.placeholders.disabled;
                    data.isPlaceholder = true;
                } else {
                    data.isEditable = true;
                    data.isPlaceholder = false;
                    data.prompt = this.value.prompt ? this.value.prompt : this.placeholders.empty;
                }
                data.prompt = App.Localizer.parseLabelText(data.prompt);
                return data;
            },

            updateUIValue: function (value) {
                if (!value) {
                    this.ui.input.val('');
                } else {
                    this.ui.input.val(value);
                }
            },

            hidePlaceholder: function () {
                this.$el.find('.js-placeholder').addClass('hidden');
                this.$el.find('.js-input').removeClass('hidden');
            },

            showPlaceholder: function () {
                this.$el.find('.js-placeholder').removeClass('hidden');
                this.$el.find('.js-input').addClass('hidden');
            },

            isNotEmpty: function () {
                return this.value.data && (this.value.data[0].dataValue !== null || this.value.data[0].instanceId !== null);
            },

            unSetValidationError: function () {
                if (this.isNotEmpty()) {
                    this.$el.parents('div.field-invalid').removeClass('field-invalid');
                    App.FormMediator.unSetValidationError(this.value.generalModel && this.value.generalModel.get('dataId'));
                }
            },

            getEditedData: function () {
                var editedData = {},
                    val = '';

                if (this.value.type === 'Selector' || this.value.type === 'Instance' || this.value.type === 'Account') {
                    val = this.value.data[0] && this.value.data[0].instanceId;
                } else {
                    val = this.value.data && this.value.data[0].dataValue;
                }

                editedData[this.key] = val;
                return editedData;
            },

            refreshForm: function () {
                App.FormMediator.formDataChanged(this.getEditedData());
            }
        });
    });

