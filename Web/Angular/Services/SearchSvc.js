var SearchSvc = (function () {
    function SearchSvc($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    SearchSvc.prototype.validateSearchTerms = function (searchList) {
        console.log(searchList);
        var url = 'api/search';
        return this.$http.post(url, JSON.stringify(searchList));
    };
    SearchSvc.prototype.test2 = function () {
        var url = 'api/search/test2';
        return this.$http.get(url);
    };
    return SearchSvc;
})();
app.service('searchSvc', ['$http', '$q', function ($http, $q) { return new SearchSvc($http, $q); }]);
//# sourceMappingURL=SearchSvc.js.map