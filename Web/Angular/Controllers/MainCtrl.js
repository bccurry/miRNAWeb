app.controller('mainCtrl', ['$scope', 'messageHubSvc', function ($scope, messageHubSvc) {
        messageHubSvc.connect();
        //messageHubSvc.sendRequest();
    }]);
