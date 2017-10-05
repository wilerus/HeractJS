/**
 * Developer: Oleg Verevkin
 * Date: 27.09.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import shared from 'modules/shared';
import WindowTitleService from 'services/WindowTitleService';
import ContentView from './views/ContentView';

export default shared.application.Module.extend({
    contentView: ContentView,
    
    onRoute(containerId) {
        return recordTypeModel.fetch().then(() => {
            this.getTopNavigationItems(containerId)
                .then(topNavigationItems => {
                    this.view.setHeaderTabs(topNavigationItems, this.options.config.id);
                });

            this.recordTypeModel = recordTypeModel;
            this.view.setContainerTitle(recordTypeModel.get('name'));
            this.__updateWindowTitle();
        });
    },

    __updateWindowTitle() {
        WindowTitleService.setTitle(this.recordTypeModel ? this.recordTypeModel.get('name') : null, this.datasetModel ? this.datasetModel.get('name') : null);
    }
});
