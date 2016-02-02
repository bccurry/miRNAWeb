app.controller('mainCtrl', ['$scope', 'messageHubSvc', '$location', '$anchorScroll', '$timeout', function ($scope, messageHubSvc, $location, $anchorScroll, $timeout) {
        $scope.resultList = "";
        $scope.percentageBar = { percent: 0 };
        messageHubSvc.connect();
        $scope.$on('percentageFinishedClient', function (event, percentageFinished) {
            $scope.$apply(function () {
                $scope.percentageBar.percent = percentageFinished;
                if (percentageFinished === 100) {
                    $location.hash('results');
                    $anchorScroll();
                }
            });
        });
    }]);
//# sourceMappingURL=MainCtrl.js.map