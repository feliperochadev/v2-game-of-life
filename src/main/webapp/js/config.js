(function (angular) {
    angular.module("gameOfLife").value("config", {
        steps: 10,
        delay: 500,
        columns: 30,
        rows: 20,
        gameRunning: false,
        id: "",
        cells: []
    })
})(angular)
