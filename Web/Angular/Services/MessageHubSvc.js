var MessageHubSvc = (function () {
    function MessageHubSvc($, $rootScope) {
        this.$ = $;
        this.$rootScope = $rootScope;
    }
    MessageHubSvc.prototype.connect = function () {
        this.connection = this.$.hubConnection();
        this.proxy = this.connection.createHubProxy('perfProfileHub');
        var _this = this;
        this.proxy.on('newRequestMessageClient', function (isNewRequests) {
            _this.$rootScope.$broadcast('newRequestMessageClient', isNewRequests);
        });
        this.proxy.on('showCPSUpdate', function (profileRequestId) {
            _this.$rootScope.$broadcast('showCPSUpdate', profileRequestId);
        });
        this.connection.start();
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
    return MessageHubSvc;
})();
app.service('messageHubSvc', ['$', '$rootScope',
    function ($, $rootScope) {
        return new MessageHubSvc($, $rootScope);
    }
]);
//# sourceMappingURL=MessageHubSvc.js.map