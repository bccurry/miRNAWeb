app.directive('searchSection', function () {
    return {
        restrict: 'E',
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'Templates/SearchSection.html',
        link: function ($scope) { } //DOM manipulation
    };
});
//# sourceMappingURL=SearchSection.js.map