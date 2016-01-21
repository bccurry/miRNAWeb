app.controller('mainCtrl', ['$scope', 'messageHubSvc', ($scope, messageHubSvc: MessageHubSvc) => {
    messageHubSvc.connect();
    $scope.$on('percentageFinishedClient', (event, percentageFinished: number) => {
        $scope.percentageFinished = percentageFinished;
    });   
}]);   