var SearchSection = (function () {
    function SearchSection(searchSvc) {
        var _this = this;
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
        this.scope = {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            searchList: '='
        };
        this.templateUrl = 'Angular/Templates/SearchSection.html';
        this.link = function (scope) {
            scope.compute = function () {
                _this.searchSvc.validateSearchTerms(scope.searchList).then(function (result) { console.log(result.data); });
            };
        };
        this.searchSvc = searchSvc;
    }
    return SearchSection;
})();
app.directive('searchSection', ['searchSvc', function (searchSvc) { return new SearchSection(searchSvc); }]);
