app.directive('headerSection', () => {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'
        },
        templateUrl: 'Angular/Templates/HeaderSection.html',
        link: ($scope) => { } //DOM manipulation
    }
});