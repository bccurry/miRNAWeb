var SearchSvc = (function () {
    function SearchSvc($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    SearchSvc.prototype.processSearchRequest = function (delimitedSearchTerms, isMirnaAndTermSearch) {
        var request = { DelimitedSearchTerms: delimitedSearchTerms, IsMirnaAndTermSearch: isMirnaAndTermSearch };
        var url = 'api/search';
        return this.$http.post(url, request);
    };
    SearchSvc.prototype.retrieveAbstracts = function (request) {
        var url = 'api/search/abstracts';
        return this.$http.post(url, request);
    };
    SearchSvc.prototype.retrieveLogEntropys = function (request) {
        var url = 'api/search/logentropys';
        return this.$http.post(url, request);
    };
    return SearchSvc;
})();
app.service('searchSvc', ['$http', '$q', function ($http, $q) { return new SearchSvc($http, $q); }]);
//# sourceMappingURL=SearchSvc.js.map