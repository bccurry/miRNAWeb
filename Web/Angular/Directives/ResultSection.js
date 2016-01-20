app.directive('resultSection', function () {
    return {
        restrict: 'E',
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'Angular/Templates/ResultSection.html',
        link: function ($scope) { } //DOM manipulation
    };
});
