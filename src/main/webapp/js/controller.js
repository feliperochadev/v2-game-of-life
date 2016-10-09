(function (angular) {
    angular.module("gameOfLife").controller("gameOfLifeController", Controller)
    function Controller($scope, $http, config) {
        var stompClient = null
        var loadConfig = function (config) {
            $scope.config = config
            $scope.loadGame = loadGame
            $scope.startGame = startGame
            $scope.stopGame = stopGame
            $scope.generateRandom = generateRandom
            loadGame(config)
        }
        var loadGame = function (config) {
            if (config.columns <= 40 && config.rows <= 40) {
                config.cells = []
                for (var y = 0; y < config.rows; y++) {
                    config.cells[y] = []
                    for (var x = 0; x < config.columns; x++) {
                        config.cells[y][x] = {y: y, x: x, alive: false}
                    }
                }
                $scope.config = config
            }
            else {
                $scope.errors = {
                    message: "The quantity of rows and columns must be lower or equal than 40!",
                    visible: true
                }
            }
        }
        var generateRandom = function (config) {
            for (var y = 0; y < config.cells.length; y++) {
                for (var x = 0; x < config.cells[y].length; x++) {
                    config.cells[y][x].alive = Math.floor(Math.random() * 10) % 2 === 0
                }
            }
            $scope.config = config
        }

        function generateGUID() {
            return ("_" + S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase()
        }

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        var startGame = function (config) {
            config.gameRunning = true
            config.id = generateGUID()
            var socket = new SockJS('/gameoflife-websocket')
            stompClient = Stomp.over(socket)
            stompClient.connect({}, function () {
                stompClient.subscribe("/v2/game-of-life/subscribe/"+config.id, function (data) {
                    $scope.$apply(function () {
                        var gameConfig = JSON.parse(data.body)
                        config.cells = gameConfig.cells
                        config.steps = gameConfig.steps
                        config.gameRunning = gameConfig.gameRunning
                        $scope.config = config
                        if (!config.gameRunning) {
                            stompClient.disconnect()
                            console.log("Game Finished")
                        }
                    })
                })
                $http.post("/api/v2/game-of-life/"+config.id, config)
                    .success(function (){console.log("Game Started")})
                    .error(function (data) {
                        $scope.errors = {message: "Error: " + data.message, visible: true}
                        stopGame(config)})
            })
        }
        var stopGame = function (config) {
            config.gameRunning = false
            $scope.config = config
            stompClient.disconnect()
            console.log("Game Stopped")
        }
        loadConfig(config)
    }
})(angular)