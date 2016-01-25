var ResultSection = (function () {
    function ResultSection() {
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
        this.scope = {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            resultList: '=',
            percentageFinished: '='
        };
        this.templateUrl = 'Angular/Templates/ResultSection.html';
        this.link = function (scope) {
            //        scope.$watch('percentageFinished', (newVal, oldVal) => {
            //            console.log(newVal);
            //            if (!(newVal === oldVal)) {
            //                scope.resultBarPercentage = { "width": newVal + '%' };
            //            }
            //        });
        };
    }
    return ResultSection;
})();
app.directive('resultSection', [function () { return new ResultSection(); }]);
//# sourceMappingURL=ResultSection.js.map