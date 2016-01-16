app.directive('resultSection', () => {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'Angular/Templates/ResultSection.html',
        link: ($scope) => { } //DOM manipulation
    }
});