var app = angular.module('mirnaApp', ['ui.router']);
app.value('$', $);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider) => {
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