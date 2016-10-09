(function (angular) {
    angular.module("gameOfLife").value("config", {
        steps: 10,
        delay: 200,
        columns: 30,
        rows: 20,
        gameRunning: false,
        id: "",
        cells: []
    })
})(angular)
