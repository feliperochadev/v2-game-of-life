(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(angular) {
    'use strict'
    //var angular = require('angular') //if cdn is off uncomment here
    var app = angular.module("gameOfLife", [])
    app.value("gameConfig", {
        steps: 10,
        delay: 500,
        columns: 30,
        rows: 20,
        gameRunning: false,
        idOnline: {id: ""},
        cells: []
    })
    app.factory("webSocketConfig", require('./webSocketConfig'))
    app.service("gameService", require('./gameService'))
    app.controller("gameOfLifeController", require('./controller'))
})(angular)

},{"./controller":2,"./gameService":3,"./webSocketConfig":4}],2:[function(require,module,exports){
'use strict'
module.exports = function ($scope, $timeout, gameService) {
    var init = function (gameConfig) {
        $scope.gameConfig = gameConfig
        $scope.loadGame = loadGame
        $scope.generateRandom = generateRandom
        $scope.cellClick = cellClick
        $scope.cellHold = cellHold
        $scope.startGame = startGame
        $scope.stopGame = stopGame
        $scope.onGameStatusChanged = onGameStatusChanged
        $scope.onError = onError
        loadGame(gameConfig)
    }

    var loadGame = function (gameConfig) {
        gameConfig.cells = []
        for (var y = 0; y < gameConfig.rows; y++) {
            gameConfig.cells[y] = []
            for (var x = 0; x < gameConfig.columns; x++) {
                gameConfig.cells[y][x] = {y: y, x: x, alive: false}
            }
        }
        gameService.checkQuantityOfSteps()
    }

    var generateRandom = function (gameConfig) {
        for (var y = 0; y < gameConfig.cells.length; y++) {
            for (var x = 0; x < gameConfig.cells[y].length; x++) {
                gameConfig.cells[y][x].alive = Math.floor(Math.random() * 10) % 2 === 0
            }
        }
        gameService.checkQuantityOfSteps()
    }

    var cellClick = function (gameRunning, cell) {
        if (!gameRunning) {
            cell.alive = !cell.alive
        }
    }

    var cellHold = function (gameRunning, mouseHold, cell) {
        if (!gameRunning && mouseHold) {
            cell.alive = true
        }
    }

    var startGame = function () {
        gameService.startGame(onGameUpdated, onGameStarted, onError)
    }

    var stopGame = function () {
        gameService.stopGame(onGameStopped)
    }

    var onGameStarted = function (httpRequest) {
        httpRequest.success(function () {
            onGameStatusChanged("Game started!")
        }).error(function (data) {
            onError(data.message)
            stopGame()
        })
    }

    var onGameUpdated = function (gameConfigReturn, gameConfig) {
        gameConfig.cells = gameConfigReturn.cells
        gameConfig.steps = gameConfigReturn.steps
        gameConfig.gameRunning = gameConfigReturn.gameRunning
        if (!gameConfig.gameRunning && gameConfig.steps === 0) {
            onGameStatusChanged("Game finished!")
        }
        $scope.$digest()
    }

    var onGameStopped = function (httpRequest) {
        httpRequest.success(function () {
            onGameStatusChanged("Game stopped!")
        }).error(function (data) {
            onError(data.message)
        })
    }

    var onGameStatusChanged = function (message) {
        $scope.gameStatus = {message: message, visible: true}
    }

    var onError = function (message) {
        $scope.errors = {message: "Error: " + message, visible: true}
        $timeout(function () {
            $scope.errors = {message: "", visible: false}
        }, 10000)
        console.log("Error: " + message)
    }

    init(gameService.getGameConfig())
}
},{}],3:[function(require,module,exports){
'use strict'
module.exports = function ($http, gameConfig, webSocketConfig) {
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

    this.checkQuantityOfSteps = function () {
        if (gameConfig.steps <= 0) {
            gameConfig.steps = _defaultQuantityOfSteps
        }
    }

    this.getGameConfig = function () {
        return gameConfig
    }

    var _generateGUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4()
    }
}
},{}],4:[function(require,module,exports){
'use strict'
/*if cdn is off uncomment here:
var SockJS = require('sockjs-client')
var Stomp = require('stompjs') */
module.exports = function() {
    var _stompClient
    var _connected = false

    var _isConnected = function () {
        return _connected
    }
    var _connect = function (onConnected, onError, webSocketEndpoint) {
        _stompClient = Stomp.over(new SockJS(webSocketEndpoint))
        _stompClient.connect({}, function () {
            _connected = true
            onConnected()
        }, function (ex) {
            onError(ex.message)
        })
    }
    var _disconnect = function () {
        _stompClient.disconnect()
        _connected = false
    }

    var _subscribe = function (onSubscribedGame, onGameUpdated, queueEndpoint) {
        _stompClient.subscribe(queueEndpoint, function (data) {
            onSubscribedGame(onGameUpdated, data)
        })
    }
    var _unsubscribe = function () {
        _stompClient.unsubscribe()
    }

    return {
        isConnected: _isConnected,
        connect: _connect,
        disconnect: _disconnect,
        subscribe: _subscribe,
        unsubscribe: _unsubscribe
    }
}
},{}]},{},[1]);
