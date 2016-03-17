app.directive('headerSection', function () {
    return {
        restrict: 'E',
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'Angular/Templates/HeaderSection.html',
        link: function ($scope) { } //DOM manipulation
    };
});
