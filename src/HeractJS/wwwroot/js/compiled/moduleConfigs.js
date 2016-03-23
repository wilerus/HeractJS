/**
 * Developer: Stepan Burguchev
 * Date: 11/17/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define('app/mytasks/main/Config',[], {
    id: 'module:myTasks',
    module: 'app/mytasks/main/Initializer',
    navigationUrl: {
        default: 'MyTasks/Main',
        task: 'MyTasks/Main/:taskId'
    },
    routes: {
        'MyTasks/Main': 'showTasks',
        'MyTasks/Main/:taskId': 'showTask'
    }
});

define('app/mytasks/main/formDesigner/Config',[], {
    id: 'module:myTasks:formDesigner',
    module: 'app/mytasks/main/formDesigner/Initializer',
    navigationUrl: {
        default: 'MyTasks/Main/:taskId/Form'
    },
    routes: {
        'MyTasks/Main/:taskId/Form': 'navigateToForm'
    }
});
define('app/documents/main/Config',[], {
    module: 'app/documents/main/Initializer',
    routes: {
        'Documents/Main': 'applyNavigation',
        'Documents/Main/:did': 'applyNavigation'
    }
});
define('app/activity/main/Config',[], {
    module: 'app/activity/main/Initializer',
    routes: {
        'Activity/Main': 'showActivity'
    }
});
/**
 * Developer: Stepan Burguchev
 * Date: 11/17/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define('app/mining/Config',[], {
    module: 'app/mining/Initializer',
    routes: {
        'Mining': 'navigate'
   }
});

define('app/tutorial/Config',[], {
    module: 'app/tutorial/Initializer',
    routes: {
        'GettingStarted/Tutorial': 'showTutorial',
        'GettingStarted/Tutorial/:tid': 'showAndStartTutorial'
    }
});
define('app/permalink/Config',[], {
    module: 'app/permalink/Initializer',
    routes: {
        'Task/:id': 'showTask',
        'Conversation/:id': 'showConversation',
        'User/:id': 'showPerson',
        'Document/:id': 'showDocument',
        'Achievement/:id': 'showAchievement',
        'Update/:id': 'showUpdate'
    }
});
/**
 * Developer: Stepan Burguchev
 * Date: 11/17/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define('app/settings/groups/Config',[], {
    id: 'module:settings:groups',
    module: 'app/settings/groups/Initializer',
    navigationUrl: {
        default: 'Settings/Groups',
        group: 'Settings/Groups/:groupId'
    },
    routes: {
        'Settings/Groups': 'showDefaultGroup',
        'Settings/Groups/:groupId': 'showGroup'
    }
});

/**
 * Developer: Denis Krasnovskiy
 * Date: 04/08/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define('app/settings/roles/Config',[], {
    id: 'module:settings:roles',
    module: 'app/settings/roles/Initializer',
    navigationUrl: {
        default: 'Settings/Roles',
        role: 'Settings/Roles/:roleId'
    },
    routes: {
        'Settings/Roles': 'showDefaultRole',
        'Settings/Roles/:roleId': 'showRole'
    }
});
/**
 * Developer: Krasnovskiy Denis
 * Date: 08/12/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define('app/settings/activeDirectory/Config',[], {
    id: 'module:settings:activeDirectory',
    module: 'app/settings/activeDirectory/Initializer',
    navigationUrl: {
        default: 'Settings/activeDirectory'
    },
    routes: {
        'Settings/activeDirectory': 'showModule'
    }
});

define('app/settings/emailServer/Config',[], {
    module: 'app/settings/emailServer/Initializer',
    routes: {
        'Settings/EmailServer': 'showEmailServerSettings'
    }
});
define('app/settings/workCalendars/Config',[], {
    module: 'app/settings/workCalendars/Initializer',
    routes: {
        'Settings/WorkCalendars': 'showDefaultCalendar',
        'Settings/WorkCalendars/:calendarId': 'showCalendar'
    }
});
define('app/settings/awards/Config',[], {
    module: 'app/settings/awards/Initializer',
    routes: {
        'Settings/Awards': 'showAwards',
        "Settings/Awards/:id": 'routePreview',
        "Settings/Awards/:id/:name": "routePreviewAndSearch"
    }
});
define('app/settings/license/Config',[], {
    module: 'app/settings/license/Initializer',
    routes: {
        'Settings/Licensing': 'showLicenses'
    }
});
define('app/settings/activedirectoryintegration/Config',[], {
    module: 'app/settings/activedirectoryintegration/Initializer',
    routes: {
        'Settings/ActiveDirectoryIntegration': 'showADSettings'
    }
});
define('app/settings/timesheetsettings/Config',[], {
    module: 'app/settings/timesheetsettings/Initializer',
    routes: {
        'Settings/Timesheets': 'showTimesheetSettings',
        'Settings/Timesheets/:tsId': 'showTimesheetSettings'
    }
}); 
define('app/settings/resourcePools/Config',[], {
    module: 'app/settings/resourcePools/Initializer',
    routes: {
        'Settings/ResourcePools': 'showDefaultPool',
        'Settings/ResourcePools/:resPoolId': 'showResourcePool'
    }
});
define('app/settings/security/Config',[], {
    module: 'app/settings/security/Initializer',
    routes: {
        'Settings/Security': 'showSecurity',
        'Settings/Security/:id': 'showSecurity'
    }
});
define('app/settings/skills/Config',[], {
    module: 'app/settings/skills/Initializer',
    routes: {
        'Settings/Skills': 'showAllSkills',
        'Settings/Skills/:id': 'routePreview',
        'Settings/Skills/:id/:name': 'routePreviewAndSearch'
    }
});
define('app/settings/workSpaces/Config',[], {
    id: 'module:settings:workspace',
    module: 'app/settings/workSpaces/Initializer',
    navigationUrl: {
        default: 'Settings/Workspaces',
        workspaceById: 'Settings/Workspaces/:workspaceId'
    },
    routes: {
        'Settings/Workspaces': 'showDefaultWorkSpace',
        'Settings/Workspaces/:workSpaceId': 'showWorkSpace'
    }
});

define('app/people/users/Config',[], {
    id: 'module:people:users',
    module: 'app/people/users/Initializer',
    navigationUrl: {
        default: 'People/Users',
        user: 'People/Users/:userId'
    },
    routes: {
        'People/Users': 'showUsers',
        'People/Users/:uid': 'routePreview',
        'People/Users/cfid-:id': 'routePreviewClearFilter',
        'People/Users/id-:id/:name': 'routePreviewAndSearch'
    }
});
define('app/people/organizationchart/Config',[], {
    module: 'app/people/organizationchart/Initializer',
    routes: {
        'People/OrganizationChart': 'showOrganizationChart',
        'People/OrganizationChart/:uid': 'showOrganizationChart'
    }
});
define('app/room/overview/Config',[], {
    id: 'module:project:rooms:overview',
    module: 'app/room/overview/Initializer',
    navigationUrl: {
        default: 'Room/:roomId/Info'
    },
    routes: {
        'Room/:rid/Info': 'showRoom',
        'Room/:rid/Info?isNew': 'showNewRoom'
    }
});
define('app/room/documents/Config',[], {
    module: 'app/room/documents/Initializer',
    routes: {
        'Room/:rid/Documents': 'applyNavigation',
        'Room/:rid/Documents/:did': 'applyNavigation'
    }
});
define('app/room/showall/Config',[], {
	id: 'module:project:rooms:showAll',
	module: 'app/room/showall/Initializer',
	navigationUrl: {
		default: 'Room/ShowAll'
	},
	routes: {
		'Room/ShowAll': 'showAllRooms'
	}
});
define('app/timesheets/approval/Config',[], {
    module: 'app/timesheets/approval/Initializer',
    routes: {
        'Timesheets/Approval': 'applyNavigation',
    }
});
define('app/timesheets/submit/Config',[], {
    module: 'app/timesheets/submit/Initializer',
    routes: {
        'Timesheets/Timesheet': 'applyNavigation',
    }
});
define('app/timesheets/reports/Config',[], {
    module: 'app/timesheets/reports/Initializer',
    routes: {
        'Timesheets/Reports(/:rid)': 'showLoggedTimeReport'
    }
});
define('app/profile/profile/Config',[], {
    module: 'app/profile/profile/Initializer',
    routes: {
        'Profile/Profile': 'showProfile'
    }
});
define('app/profile/notificationSettings/Config',[], {
    module: 'app/profile/notificationSettings/Initializer',
    routes: {
        'Profile/Notifications': 'showProfileNotifications'
    }
});
define('app/profile/aboutandextras/Config',[], {
    module: 'app/profile/aboutandextras/Initializer',
    routes: {
        'Profile/AboutAndExtras': 'showProfileAboutAndExtras'
    }
});
/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/editors/Config',[], {
    module: 'app/demo/editors/Initializer',
    routes: {
        'demo/editors': 'navigate'
    }
});

/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/dropdown/Config',[], {
    module: 'app/demo/dropdown/Initializer',
    routes: {
        'demo/dropdown': 'navigate'
    }
});

/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/formDesigner/Config',[], {
    module: 'app/demo/formDesigner/Initializer',
    routes: {
        'demo/formDesigner': 'navigate'
    }
});

/**
 * Developer: Grigory Kuznetsov
 * Date: 01/22/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/grid/Config',[], {
    module: 'app/demo/grid/Initializer',
    routes: {
        'demo/grid': 'navigate'
    }
});

/**
 * Developer: Grigory Kuznetsov
 * Date: 8/14/2015
 * Copyright: 2009-2015 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/nativeGrid/Config',[], {
    module: 'app/demo/nativeGrid/Initializer',
    routes: {
        'demo/nativeGrid': 'navigate'
    }
});

/**
 * Developer: Stepan Burguchev
 * Date: 9/4/2014
 * Copyright: 2009-2014 Comindware®
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require */

define('app/demo/core/Config',[], {
    id: 'module:demo:core',
    module: 'app/demo/core/Initializer',
    navigationUrl: {
        default: 'demo/core',
        case: 'demo/core/:section/:group/:case'
    },
    routes: {
        'demo/core': 'navigate',
        'demo/core/:sectionId/:groupId/:caseId': 'navigateToCase'
    }
});

/* global define */

define('module/moduleConfigs',[
    'app/mytasks/main/Config',
    'app/mytasks/main/formDesigner/Config',
    'app/documents/main/Config',
    'app/activity/main/Config',
    'app/mining/Config',
    'app/tutorial/Config',
    'app/permalink/Config',
    'app/settings/groups/Config',
    'app/settings/roles/Config',
    'app/settings/activeDirectory/Config',
    'app/settings/emailServer/Config',
    'app/settings/workCalendars/Config',
    'app/settings/awards/Config',
    'app/settings/license/Config',
    'app/settings/activedirectoryintegration/Config',
    'app/settings/timesheetsettings/Config',
    'app/settings/resourcePools/Config',
    'app/settings/security/Config',
    'app/settings/skills/Config',
    'app/settings/workSpaces/Config',
    'app/people/users/Config',
    'app/people/organizationchart/Config',
    'app/room/overview/Config',
    'app/room/documents/Config',
	'app/room/showall/Config',
    'app/timesheets/approval/Config',
    'app/timesheets/submit/Config',
    'app/timesheets/reports/Config',
    'app/profile/profile/Config',
    'app/profile/notificationSettings/Config',
    'app/profile/aboutandextras/Config',
    'app/demo/editors/Config',
    'app/demo/dropdown/Config',
    'app/demo/formDesigner/Config',
    'app/demo/grid/Config',
    'app/demo/nativeGrid/Config',
    'app/demo/core/Config'
], function () {
    "use strict";

    return Array.prototype.slice.call(arguments, 0);
});

