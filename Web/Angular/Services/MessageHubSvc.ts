interface IMessageHubSvc {
    connect();
    isConnecting();
    isConnected();
    connectionState();
}

class MessageHubSvc implements IMessageHubSvc {
    private $;
    private $rootScope;
    private connection;
    private proxy;

    constructor($, $rootScope) {
        this.$ = $;
        this.$rootScope = $rootScope;
    }

    connect() {

        this.connection = this.$.hubConnection();
        this.proxy = this.connection.createHubProxy('perfProfileHub');
        var _this = this;
        this.proxy.on('newRequestMessageClient', (isNewRequests: boolean) => {
            _this.$rootScope.$broadcast('newRequestMessageClient', isNewRequests);
        });
        this.proxy.on('showCPSUpdate', (profileRequestId: number) => {
            _this.$rootScope.$broadcast('showCPSUpdate', profileRequestId);
        });
        this.connection.start();
    }

    isConnecting() {
        return this.connection.state === 0;
    }

    isConnected() {
        return this.connection.state === 1;
    }

    connectionState() {
        return this.connection.state;
    }
}

app.service('messageHubSvc', ['$', '$rootScope',
    ($, $rootScope) => {
        return new MessageHubSvc($, $rootScope);
    }
]); 