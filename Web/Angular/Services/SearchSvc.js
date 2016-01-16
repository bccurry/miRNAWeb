var SearchSvc = (function () {
    function SearchSvc($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    SearchSvc.prototype.validateSearchTerms = function (searchList) {
        var url = '/search/validatesearchterms/';
        return this.$http.post(url, searchList);
    };
    return SearchSvc;
})();
app.service('searchSvc', ['$http', '$q', function ($http, $q) { return new SearchSvc($http, $q); }]);
