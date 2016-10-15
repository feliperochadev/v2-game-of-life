(function(angular) {
    angular.module("gameOfLife").service("gameService", function ($http, gameConfig, webSocketConfig) {
        this.startGame = function (onGameUpdated, onGameStarted, onError) {
            gameConfig.gameRunning = true
            gameConfig.idOnline.id = _generateGUID()
            var apiEndpoint = "/api/v2/game-of-life/" + gameConfig.idOnline.id
            var queueEndpoint = "/queue/subscribe/" + gameConfig.idOnline.id
            if (webSocketConfig.isConnected()) {
                webSocketConfig.subscribe(_onSubscribedGame, onGameUpdated, queueEndpoint)
                onGameStarted($http.post(apiEndpoint, gameConfig))
            }
            else {
                webSocketConfig.connect(function onConnected() {
                    webSocketConfig.subscribe(_onSubscribedGame, onGameUpdated, queueEndpoint)
                    onGameStarted($http.post(apiEndpoint, gameConfig))
                }, onError, "/gameoflife-websocket")
            }
        }

        this.stopGame = function (onGameStopped) {
            webSocketConfig.disconnect()
            onGameStopped($http.delete("/api/v2/game-of-life/" + gameConfig.idOnline.id))
            gameConfig.gameRunning = false
        }

        var _onSubscribedGame = function (onGameUpdated, data) {
            var gameConfigReturn = JSON.parse(data.body)
            onGameUpdated(gameConfigReturn, gameConfig)
            if (!gameConfigReturn.gameRunning) {
                webSocketConfig.unsubscribe()
            }
        }

        var _defaultQuantityOfSteps = gameConfig.steps

        this.checkQuantityOfSteps = function() {
            if(gameConfig.steps <= 0) {
                gameConfig.steps = _defaultQuantityOfSteps
            }
        }

        this.getGameConfig = function () {
            return gameConfig
        }

       var _generateGUID = function  () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4()
        }

    })
})(angular)