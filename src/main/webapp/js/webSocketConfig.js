(function(Stomp, SockJS) {
    angular.module("gameOfLife").factory("webSocketConfig", function(){
        var _stompClient
        var _connected = false

        var _isConnected = function(){return _connected}
        var _connect = function(onConnected, onError, webSocketEndpoint) {
            _stompClient = Stomp.over(new SockJS(webSocketEndpoint))
            _stompClient.connect({}, function(){
                _connected = true
                onConnected()
            }, function(ex){onError(ex.message)})
        }
        var _disconnect = function() {
            _stompClient.disconnect()
            _connected = false
        }

        var _subscribe = function(onSubscribedGame, onGameUpdated, queueEndpoint) {
            _stompClient.subscribe(queueEndpoint, function(data){
                onSubscribedGame(onGameUpdated, data)
            })
        }
        var _unsubscribe = function(){_stompClient.unsubscribe()}

        return{
            isConnected: _isConnected,
            connect: _connect,
            disconnect: _disconnect,
            subscribe: _subscribe,
            unsubscribe: _unsubscribe
        }
    })
})(Stomp, SockJS)