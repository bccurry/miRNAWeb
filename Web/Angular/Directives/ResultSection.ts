class ResultSection implements angular.IDirective {
    private messageHubSvc: IMessageHubSvc;

    constructor(messageHubSvc) {
        this.messageHubSvc = messageHubSvc;
    }

    restrict = 'E'; //E = element, A = attribute, C = class, M = comment         
    scope = {
        //@ reads the attribute value, = provides two-way binding, & works with functions
    };
    templateUrl = 'Angular/Templates/ResultSection.html';



    link = (scope) => {
//        console.log("RESULT");
//        this.messageHubSvc.connect();
//        $scope.$on('newRequestMessageClient', (event, isNewRequests: boolean) => {
//            $scope.newRequests.anyNew = isNewRequests;
//            $scope.$apply();
//        });
//        scope.compute = () => {
//            this.searchSvc.validateSearchTerms(scope.searchList).then((result) => { console.log(result.data) });
//        };


    }
}

app.directive('resultSection', ['messageHubSvc', (messageHubSvc) => { return new ResultSection(messageHubSvc); }]);