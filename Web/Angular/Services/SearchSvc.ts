interface ISearchSvc {
    validateSearchTerms(searchList: string);
    test2();
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
        var url = 'api/search';
        return this.$http.post(url, JSON.stringify(searchList));
    }

    test2() {
        var url = 'api/search/test2';
        return this.$http.get(url);
    }
}

app.service('searchSvc', ['$http','$q', ($http, $q) => { return new SearchSvc($http, $q); }]); 