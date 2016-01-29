interface ISearchSvc {
    processSearchRequest(searchList: string);
}

class SearchSvc implements ISearchSvc {
    private $http;
    private $q;

    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    processSearchRequest(delimitedSearchTerms: string) {
        var request = { DelimitedSearchTerms: delimitedSearchTerms, IsMirnaAndTermSearch: false }
        var url = 'api/search';
        return this.$http.post(url, request);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 