interface ISearchSvc {
    processSearchRequest(delimitedSearchTerms: string, isMirnaAndTermSearch: boolean);
}

class SearchSvc implements ISearchSvc {
    private $http;
    private $q;

    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    processSearchRequest(delimitedSearchTerms: string, isMirnaAndTermSearch: boolean) {
        var request = { DelimitedSearchTerms: delimitedSearchTerms, IsMirnaAndTermSearch: isMirnaAndTermSearch };
        var url = 'api/search';
        return this.$http.post(url, request);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 