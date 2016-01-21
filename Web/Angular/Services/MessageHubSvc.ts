interface IMessageHubSvc {
    connect();
    isConnecting();
    isConnected();
    connectionState();
    sendRequest();
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
        this.proxy = this.connection.createHubProxy('messageHub');
        var innerThis = this;

        this.connection.start().done(() => {
            console.log(innerThis.isConnected());
        }).fail((error) => {
            console.log('Invocation of start failed. Error: ' + error);
            });

        this.proxy.on('percentageFinishedClient', (count: string) => {
            innerThis.$rootScope.$broadcast('percentageFinishedClient', count);
        });

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

    sendRequest() {
    //Invoking greetAll method defined in hub
    this.proxy.invoke('greetAll');
}
}

app.service('messageHubSvc', ['$', '$rootScope',
    ($, $rootScope) => {
        return new MessageHubSvc($, $rootScope);
    }
]); 