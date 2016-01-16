interface ISearchSvc {
    validateSearchTerms(searchList: string);
}

class SearchSvc implements ISearchSvc {
    private $http;
    private $q;

    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    validateSearchTerms(searchList: string) {
        var url = '/search/validatesearchterms/';
        return this.$http.post(url, searchList);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 