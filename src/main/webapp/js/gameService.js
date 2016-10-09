(function(angular) {
    angular.module("gameOfLife").factory("gameService", function ($http, config) {
        var _stompClient = null
        var _loadGame = function (config) {
            config.cells = []
            for (var y = 0; y < config.rows; y++) {
                config.cells[y] = []
                for (var x = 0; x < config.columns; x++) {
                    config.cells[y][x] = {y: y, x: x, alive: false}
                }
            }
        }
        var _generateRandom = function () {
            for (var y = 0; y < config.cells.length; y++) {
                for (var x = 0; x < config.cells[y].length; x++) {
                    config.cells[y][x].alive = Math.floor(Math.random() * 10) % 2 === 0
                }
            }
        }
        var _startGame = function (onUpdate, onConnected) {
            config.gameRunning = true
            config.id = _generateGUID()
            _stompClient = Stomp.over(new SockJS('/gameoflife-websocket'))
            _stompClient.connect({}, function () {
                _stompClient.subscribe("/queue/subscribe/" + config.id, function (data) {
                    var gameConfigReturn = JSON.parse(data.body)
                    onUpdate(gameConfigReturn, config)
                    if (!gameConfigReturn.gameRunning) {
                        _stompClient.disconnect()
                        console.log("Game Finished")
                    }
                })
                onConnected($http.post("/api/v2/game-of-life/" + config.id, config))
            })
        }
        var _stopGame = function () {
            config.gameRunning = false
            _stompClient.disconnect()
            console.log("Game Stopped")
        }
        var _getConfig = function () {
            return config
        }
        var _generateGUID = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        return {
            loadGame: _loadGame,
            generateRandom: _generateRandom,
            startGame: _startGame,
            stopGame: _stopGame,
            getConfig: _getConfig
        }
    })
})(angular)