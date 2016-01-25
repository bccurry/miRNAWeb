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
    private $timeout;

    constructor($, $rootScope, $timeout) {
        this.$ = $;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
    }

    connect() {
        var innerThis = this;
        this.connection = this.$.hubConnection();
        this.connection.logging = true;
        this.proxy = this.connection.createHubProxy('messageHub');
        this.proxy.on('percentageFinishedClient', (percentageFinished: number) => {
            innerThis.$rootScope.$broadcast('percentageFinishedClient', percentageFinished);
        });

        this.connection.start().done(() => {  
            console.log(innerThis.isConnected());
        }).fail((error) => {
            console.log('Invocation of start failed. Error: ' + error);
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

app.service('messageHubSvc', ['$', '$rootScope', '$timeout',
    ($, $rootScope, $timeout) => {
        return new MessageHubSvc($, $rootScope, $timeout);
    }
]); 