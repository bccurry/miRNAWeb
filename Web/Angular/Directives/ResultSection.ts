class ResultSection implements angular.IDirective {

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        resultList: '=',
        percentageFinished: '='
    };

    templateUrl = 'Angular/Templates/ResultSection.html';

    link = (scope) => {

        scope.$watch("resultList.TermResultTerms", (newVal) => {
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

    }
}

app.directive('resultSection', [() => { return new ResultSection(); }]);