/**
 * Developer: Oleg Verevkin
 * Date: 08.11.2016
 * Copyright: 2009-2017 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

import ChatikItemView from './ChatikItemView';

export default Marionette.CollectionView.extend({
    childView: ChatikItemView
});
