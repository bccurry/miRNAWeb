interface ISearchSvc {
    processSearchRequest(delimitedSearchTerms: string, isMirnaAndTermSearch: boolean);
    retrieveAbstracts(request);
    retrieveLogEntropys(request);
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

    retrieveAbstracts(request) {
        var url = 'api/search/abstracts';
        return this.$http.post(url, request);
    }

    retrieveLogEntropys(request) {
        var url = 'api/search/logentropys';
        return this.$http.post(url, request);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 