declare var angular: angular.IAngularStatic;
declare var cytoscape: any;
var app = angular.module('mirnaApp', ['ui.router', 'ui.grid', 'ui.grid.infiniteScroll']);
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