var ResultSection = (function () {
    function ResultSection(messageHubSvc) {
        this.restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
        this.scope = {};
        this.templateUrl = 'Angular/Templates/ResultSection.html';
        this.link = function (scope) {
            //        console.log("RESULT");
            //        this.messageHubSvc.connect();
            //        $scope.$on('newRequestMessageClient', (event, isNewRequests: boolean) => {
            //            $scope.newRequests.anyNew = isNewRequests;
            //            $scope.$apply();
            //        });
            //        scope.compute = () => {
            //            this.searchSvc.validateSearchTerms(scope.searchList).then((result) => { console.log(result.data) });
            //        };
        };
        this.messageHubSvc = messageHubSvc;
    }
    return ResultSection;
})();
app.directive('resultSection', ['messageHubSvc', function (messageHubSvc) { return new ResultSection(messageHubSvc); }]);
//# sourceMappingURL=ResultSection.js.map