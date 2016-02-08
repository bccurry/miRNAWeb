var MessageHubSvc = (function () {
    function MessageHubSvc($, $rootScope, $timeout) {
        this.$ = $;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
    }
    MessageHubSvc.prototype.connect = function () {
        var innerThis = this;
        this.connection = this.$.hubConnection();
        this.connection.logging = true;
        this.proxy = this.connection.createHubProxy('messageHub');
        this.proxy.on('percentageFinishedClient', function (percentageFinished) {
            innerThis.$rootScope.$broadcast('percentageFinishedClient', percentageFinished);
        });
        this.connection.start().done(function () {
            console.log(innerThis.isConnected());
        }).fail(function (error) {
            console.log('Invocation of start failed. Error: ' + error);
        });
    };
    MessageHubSvc.prototype.isConnecting = function () {
        return this.connection.state === 0;
    };
    MessageHubSvc.prototype.isConnected = function () {
        return this.connection.state === 1;
    };
    MessageHubSvc.prototype.connectionState = function () {
        return this.connection.state;
    };
    MessageHubSvc.prototype.sendRequest = function () {
        //Invoking greetAll method defined in hub
        this.proxy.invoke('greetAll');
    };
    return MessageHubSvc;
})();
app.service('messageHubSvc', ['$', '$rootScope', '$timeout',
    function ($, $rootScope, $timeout) {
        return new MessageHubSvc($, $rootScope, $timeout);
    }
]);
//# sourceMappingURL=MessageHubSvc.js.map