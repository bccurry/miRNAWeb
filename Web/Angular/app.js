var app = angular.module('mirnaApp', ['ui.router', 'ui.grid', 'ui.grid.infiniteScroll', 'ngSanitize']);
app.value('$', $);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlRouterProvider.otherwise('/mirna');
        $stateProvider
            .state('main', {
            url: '/mirna',
            templateUrl: 'Angular/Views/Main.html',
            controller: 'mainCtrl'
        });
    }]);
//# sourceMappingURL=app.js.map