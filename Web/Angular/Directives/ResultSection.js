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
            scope.$watch("resultList.TermResultTerms", function (newVal) {
                if (newVal) {
                    scope.gridClass = "col-md-6";
                }
            }, true);
            scope.gridClass = "";
            scope.gridOptionsMirna = {};
            scope.gridOptionsMirna.data = 'resultList.MirnaResultTerms';
            scope.gridOptionsMirna.columnDefs = [
                { name: 'Name', displayName: 'MiRNA' },
                { name: 'IsActive', displayName: 'Active', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.IsActive">' }
            ];
            scope.gridOptionsTerm = {};
            scope.gridOptionsTerm.data = 'resultList.TermResultTerms';
            scope.gridOptionsTerm.columnDefs = [
                { name: 'Name', displayName: 'Term' },
                { name: 'ISActive', displayName: 'Active', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="">' }
            ];
        };
    }
    return ResultSection;
})();
app.directive('resultSection', [function () { return new ResultSection(); }]);
