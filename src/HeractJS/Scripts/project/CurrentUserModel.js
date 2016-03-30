define([], function () {
    'use strict';

    return Backbone.Model.extend({
        idAttribute: 'UserId',
        
        initialize: function () {
//            this.computedFields = new Backbone.ComputedFields(this);
        },

        computed: {
            TutorialFinished: {
                depends: ['TutorialPercentCompleted'],
                get: function () {
                    return this.get('TutorialPercentCompleted') >= 100;
                }
            },
            TutorialsCount: {
                depends: ['IsResourcePoolManager'],
                get: function () {
                    if (this.get('IsResourcePoolManager')) {
                        return 4;
                    }
                    return 3;
                }
            },
            FullName: { // to compatibility
                depends: ['UserName'],
                get: function () {
                    return this.get('UserName');
                },
                set: function (value) {
                    this.set('UserName', value);
                }
            },
            TutorialPercentCompleted: {
                depends: ['TutorialCompletedSteps', 'TutorialsCount'],
                get: function () {
                    return 100 * this.get('TutorialCompletedSteps') / this.get('TutorialsCount');
                }
            },
            Configuration: {
                get: function () {
                    return window.Context.configurationModel.Info;
                }
            },
            CanAddUser: {
                get: function () {
                    return this.get('IsAdmin') || this.get('IsUser');
                }
            }            
        }        
    });
});
