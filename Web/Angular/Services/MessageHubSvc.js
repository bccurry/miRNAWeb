var MessageHubSvc = (function () {
    function MessageHubSvc($, $rootScope) {
        this.$ = $;
        this.$rootScope = $rootScope;
    }
    MessageHubSvc.prototype.connect = function () {
        this.connection = this.$.hubConnection();
        this.proxy = this.connection.createHubProxy('messageHub');
        var innerThis = this;
        this.connection.start().done(function () {
            console.log(innerThis.isConnected());
        }).fail(function (error) {
            console.log('Invocation of start failed. Error: ' + error);
        });
        this.proxy.on('percentageFinishedClient', function (count) {
            innerThis.$rootScope.$broadcast('percentageFinishedClient', count);
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
app.service('messageHubSvc', ['$', '$rootScope',
    function ($, $rootScope) {
        return new MessageHubSvc($, $rootScope);
    }
]);
