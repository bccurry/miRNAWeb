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
        console.log(searchList);
        var url = 'api/search/validatesearchterms/';
        return this.$http.post(url, JSON.stringify(searchList));
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 