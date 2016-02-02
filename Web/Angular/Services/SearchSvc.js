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
    return SearchSvc;
})();
app.service('searchSvc', ['$http', '$q', function ($http, $q) { return new SearchSvc($http, $q); }]);
