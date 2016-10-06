define(['dashboardInitializer'], function (dashboardInitializer) {

    return {
        id: 'module:dashboard',
        module: dashboardInitializer,
        navigationUrl: {
            default: 'dashboard',
        },
        routes: {
            'dashboard': 'navigate',
        }
    }
});