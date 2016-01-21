app.controller('mainCtrl', ['$scope', 'messageHubSvc', function ($scope, messageHubSvc) {
        messageHubSvc.connect();
        $scope.$on('percentageFinishedClient', function (event, percentageFinished) {
            $scope.percentageFinished = percentageFinished;
        });
    }]);
//# sourceMappingURL=MainCtrl.js.map