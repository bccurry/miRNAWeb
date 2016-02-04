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
        percentageFinished: '='
    };

    templateUrl = 'Angular/Templates/SearchSection.html';

    link = (scope) => {
        scope.compute = (isMirnaAndTermSearch: boolean) => {
            scope.isProcessing = true;
            this.searchSvc.processSearchRequest(scope.searchList, isMirnaAndTermSearch).then((result) => {
                scope.resultList = result.data;
                scope.errorMessage = null;
            },
            (errorResult) => {
                scope.errorMessage = errorResult.data;
                scope.isProcessing = false;
            });
        };

        scope.$watch('percentageFinished', (newVal, oldVal) => {
            console.log(newVal);
            if (!(newVal === oldVal)) {
                //this.$timeout(() => {
                scope.resultBarPercentage = { "width": newVal + '%' };
                scope.isProcessing = newVal === 100 ? false : scope.isProcessing;
                //}, 500);        
            }
        });
    
    }
}

app.directive('searchSection', ['searchSvc', '$timeout', (searchSvc, $timeout) => { return new SearchSection(searchSvc, $timeout); }]);
 



