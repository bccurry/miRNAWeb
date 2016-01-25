class ResultSection implements angular.IDirective {

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        resultList: '=',
        percentageFinished: '='
    };

    templateUrl = 'Angular/Templates/ResultSection.html';

    link = (scope) => {
//        scope.$watch('percentageFinished', (newVal, oldVal) => {
//            console.log(newVal);
//            if (!(newVal === oldVal)) {
//                scope.resultBarPercentage = { "width": newVal + '%' };
//            }
//        });
    }
}

app.directive('resultSection', [() => { return new ResultSection(); }]);