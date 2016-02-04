var SearchSection = (function () {
    function SearchSection(searchSvc, $timeout) {
        var _this = this;
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment  
        this.scope = {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            resultList: '=',
            percentageFinished: '='
        };
        this.templateUrl = 'Angular/Templates/SearchSection.html';
        this.link = function (scope) {
            scope.compute = function (isMirnaAndTermSearch) {
                scope.isProcessing = true;
                _this.searchSvc.processSearchRequest(scope.searchList, isMirnaAndTermSearch).then(function (result) {
                    scope.resultList = result.data;
                    scope.errorMessage = null;
                }, function (errorResult) {
                    scope.errorMessage = errorResult.data;
                    scope.isProcessing = false;
                });
            };
            scope.$watch('percentageFinished', function (newVal, oldVal) {
                console.log(newVal);
                if (!(newVal === oldVal)) {
                    //this.$timeout(() => {
                    scope.resultBarPercentage = { "width": newVal + '%' };
                    scope.isProcessing = newVal === 100 ? false : scope.isProcessing;
                }
            });
        };
        this.searchSvc = searchSvc;
        this.$timeout = $timeout;
    }
    return SearchSection;
})();
app.directive('searchSection', ['searchSvc', '$timeout', function (searchSvc, $timeout) { return new SearchSection(searchSvc, $timeout); }]);
//# sourceMappingURL=SearchSection.js.map