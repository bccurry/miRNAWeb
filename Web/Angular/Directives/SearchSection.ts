class SearchSection implements angular.IDirective {
    private searchSvc: ISearchSvc;

    constructor(searchSvc) {
        this.searchSvc = searchSvc;
    }

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        searchList: '='
    };
    templateUrl = 'Angular/Templates/SearchSection.html';

  

    link = (scope) => {
        scope.compute = () => {
            this.searchSvc.validateSearchTerms(scope.searchList).then((result) => {});
        };

        
    }
}

app.directive('searchSection', ['searchSvc', (searchSvc) => { return new SearchSection(searchSvc); }]);
 



