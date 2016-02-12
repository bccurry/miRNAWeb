interface ISearchSvc {
    processSearchRequest(delimitedSearchTerms: string, isMirnaAndTermSearch: boolean);
    retrieveAbstracts(requestEnumerable: string[]);
    retrieveLogEntropys(requestEnumerable: string[]);
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

    retrieveAbstracts(requestEnumerable: string[]) {
        var url = 'api/search/abstracts';
        return this.$http.post(url, requestEnumerable);
    }

    retrieveLogEntropys(requestEnumerable: string[]) {
        var url = 'api/search/logentropys';
        return this.$http.post(url, requestEnumerable);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 