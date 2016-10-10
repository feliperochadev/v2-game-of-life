(function (angular) {
    angular.module("gameOfLife").controller("gameOfLifeController", function Controller($scope, gameService) {
        var loadConfig = function (config) {
            $scope.config = config
            $scope.loadGame = loadGame
            $scope.startGame = startGame
            $scope.stopGame = stopGame
            $scope.generateRandom = generateRandom
            $scope.cellClick = cellClick
            $scope.cellHold = cellHold
            loadGame(config)
        }
        var loadGame = function (config) {
            if (config.columns <= 40 && config.rows <= 40) {
                gameService.loadGame(config)
            }
            else {
                $scope.errors = {
                    message: "The quantity of rows and columns must be lower or equal than 40!",
                    visible: true
                }
            }
        }
        var stopGame = function () {
            gameService.stopGame(onGameStopped)
        }
        var startGame = function () {
            gameService.startGame(onUpdate, onConnected)
        }
        var generateRandom = function () {
            gameService.generateRandom()
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
        var onUpdate = function (gameConfigReturn, config) {
            $scope.$apply(function () {
                config.cells = gameConfigReturn.cells
                config.steps = gameConfigReturn.steps
                config.gameRunning = gameConfigReturn.gameRunning
            })
        }
        var onConnected = function (httpRequest) {
            httpRequest.success(function () {
                console.log("Game Started")
            }).error(function (data) {
                $scope.errors = {message: "Error: " + data.message, visible: true}
                stopGame()
            })
        }
        var onGameStopped = function (httpRequest) {
            httpRequest.success(function () {
                console.log("Game Stopped")
            }).error(function (data) {
                $scope.errors = {message: "Error: " + data.message, visible: true}
            })
        }
        loadConfig(gameService.getConfig())
    })
})(angular)