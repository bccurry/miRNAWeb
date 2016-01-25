app.controller('mainCtrl', ['$scope', 'messageHubSvc', '$location', '$anchorScroll', '$timeout', ($scope, messageHubSvc: MessageHubSvc, $location, $anchorScroll, $timeout) => {
    $scope.resultList = "";
    $scope.percentageBar = { percent: 0 };
//    $timeout(() => {
        messageHubSvc.connect();
        $scope.$on('percentageFinishedClient', (event, percentageFinished: number) => {

            $scope.$apply(() => {
                $scope.percentageBar.percent = percentageFinished;
                if (percentageFinished === 100) {
                    $location.hash('results');
                    $anchorScroll();
                }
            });
        });   
//    }, 5000);
    
}]);   