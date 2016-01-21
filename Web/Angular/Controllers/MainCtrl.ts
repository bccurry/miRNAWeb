app.controller('mainCtrl', ['$scope', 'messageHubSvc', ($scope, messageHubSvc: MessageHubSvc) => {
    messageHubSvc.connect();
    //messageHubSvc.sendRequest();
}]);   