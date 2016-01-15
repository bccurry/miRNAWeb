app.directive('searchSection', () => {
        return {
            restrict: 'E', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@'
            },
            templateUrl: 'Templates/SearchSection.html',
            link: ($scope) => { } //DOM manipulation
        }
    });