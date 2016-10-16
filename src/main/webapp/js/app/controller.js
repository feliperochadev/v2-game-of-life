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