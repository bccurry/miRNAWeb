class SearchSection implements angular.IDirective {
    private searchSvc: ISearchSvc;
    private messageHubSvc: IMessageHubSvc;
    constructor(searchSvc, messageHubSvc) {
        this.searchSvc = searchSvc;
        this.messageHubSvc = messageHubSvc;
    }

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
        searchList: '='
    };
    templateUrl = 'Angular/Templates/SearchSection.html';

  

    link = (scope) => {
        //this.messageHubSvc.connect();
        
        scope.compute = () => {
            //console.log(this.messageHubSvc.isConnected());
            this.searchSvc.test2().then((result) => {});
            //this.searchSvc.validateSearchTerms(scope.searchList).then((result) => { console.log(result.data) });
        };
    
    }
}

app.directive('searchSection', ['searchSvc', 'messageHubSvc', (searchSvc, messageHubSvc) => { return new SearchSection(searchSvc, messageHubSvc); }]);
 



