var SearchSection = (function () {
    function SearchSection(searchSvc, messageHubSvc) {
        var _this = this;
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
        this.scope = {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            searchList: '='
        };
        this.templateUrl = 'Angular/Templates/SearchSection.html';
        this.link = function (scope) {
            //this.messageHubSvc.connect();
            scope.compute = function () {
                //console.log(this.messageHubSvc.isConnected());
                _this.searchSvc.test2().then(function (result) { });
                //this.searchSvc.validateSearchTerms(scope.searchList).then((result) => { console.log(result.data) });
            };
        };
        this.searchSvc = searchSvc;
        this.messageHubSvc = messageHubSvc;
    }
    return SearchSection;
})();
app.directive('searchSection', ['searchSvc', 'messageHubSvc', function (searchSvc, messageHubSvc) { return new SearchSection(searchSvc, messageHubSvc); }]);
//# sourceMappingURL=SearchSection.js.map