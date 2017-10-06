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

import shared from 'shared';

export default shared.application.Module.extend({
    contentView: new Marionette.ItemView(),
    
    navigate() {
        //WindowTitleService.setTitle(this.recordTypeModel ? this.recordTypeModel.get('name') : null, this.datasetModel ? this.datasetModel.get('name') : null);
    }
});
