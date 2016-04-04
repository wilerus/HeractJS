define([
    'comindware/core',
    './ListCanvasView'
], function (core, ListCanvasView) {
    'use strict';

    return function () {

        // 1. Get some data
        var dataArray = [];
        for (var i = 0; i < 50; i++) {
            dataArray.push({
                textCell: 'Text Cell ' + i,
                numberCell: i + 1
            });
        }

        var layoutView = Marionette.LayoutView.extend({
            template: Handlebars.compile('<div class="text-editor-wrapper"></div>'),

            regions: {
                editorWrapperRegion: '.text-editor-wrapper'
            },

            onRender: function() {
                this.editorWrapperRegion.show(new core.form.editors.TextEditor({
                    key: 'value',
                    changeMode: 'keydown',
                    autocommit: true,
                    model: this.model
                }));
                this.model.on('change', function() {
                    console.log(this.get('value'));
                })
            }
        });

        // 2. Create columns
        var columns = [
            {
                id: 'textCell',
                cellView: layoutView,
                viewModel: new Backbone.Model({displayText: 'TextCell'}),
                sortAsc: core.utils.helpers.comparatorFor(core.utils.comparators.stringComparator2Asc, 'textCell'),
                sortDesc: core.utils.helpers.comparatorFor(core.utils.comparators.stringComparator2Desc, 'textCell'),
                sorting: 'asc'
            },
            {
                id: 'numberCell',
                cellView: core.list.cellFactory.getNumberCellView(),
                viewModel: new Backbone.Model({displayText: 'Number Cell'}),
                sortAsc: core.utils.helpers.comparatorFor(core.utils.comparators.numberComparator2Asc, 'numberCell'),
                sortDesc: core.utils.helpers.comparatorFor(core.utils.comparators.numberComparator2Desc, 'numberCell'),
                sorting: 'asc',
                filterView: core.nativeGrid.filterViewFactory.getFilterViewByType()
            }
        ];

        // 3. Create VirtualCollection
        var collection = new core.collections.VirtualCollection();
        collection.reset(dataArray);

        // 4. Create grid
        var bundle = core.list.factory.createDefaultGrid({
            gridViewOptions: {
                columns: columns,
                childHeight: 40,
                useDefaultRowView: true
            },
            collection: collection
        });

        // 7. Show created views
        return new ListCanvasView({
            content: bundle.gridView,
            scrollbar: bundle.scrollbarView
        });
    }
});