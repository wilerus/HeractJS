/**
 * Developer: Daniil Korolev
 * Date: 1/4/2016
 * Copyright: 2009-2016 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define(['./controllers/FormMediator', './controllers/MockStateManager'], function (FormMediator, MockStateManager) {
    
    var instance = null;

    function MockApp() {
        this.FormMediator = new FormMediator();
        this.StateManager = new MockStateManager();
        this.reqres = {
            setHandler: function () {}
        }
        this.destroy = function () {
            instance = null;
        }
    }

    MockApp.getInstance = function () {
        if (instance == null) {
            instance = new MockApp();
        }
        return instance;
    }

    return MockApp.getInstance();
});
