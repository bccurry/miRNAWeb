class SearchSection implements angular.IDirective {
    private searchSvc: ISearchSvc;
    private $timeout;

    constructor(searchSvc, $timeout) {
        this.searchSvc = searchSvc;
        this.$timeout = $timeout;
    }

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment  
           
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        resultList: '=',
        percentageFinished: '=',
        isProcessing: '='
    };

    templateUrl = 'Angular/Templates/SearchSection.html';

    link = (scope) => {
        scope.clear = () => {
            scope.searchList = null;
        };

        scope.compute = (isMirnaAndTermSearch: boolean) => {
            scope.resultList = null;
            scope.isProcessing = true;
            this.searchSvc.processSearchRequest(scope.searchList, isMirnaAndTermSearch).then((result) => {
                scope.resultList = result.data;
                scope.errorMessage = null;
                scope.isProcessing = false;
            },
            (errorResult) => {
                scope.errorMessage = errorResult.data;
                scope.isProcessing = false;
            });
        };

        scope.$watch('percentageFinished', (newVal, oldVal) => {
            if (!(newVal === oldVal)) {
                scope.resultBarPercentage = { "width": newVal + '%' };
            }
        });
    
    }
}

app.directive('searchSection', ['searchSvc', '$timeout', (searchSvc, $timeout) => { return new SearchSection(searchSvc, $timeout); }]);
 



