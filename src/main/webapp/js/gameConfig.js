(function (angular) {
    angular.module("gameOfLife").value("gameConfig", {
        steps: 10,
        delay: 500,
        columns: 30,
        rows: 20,
        gameRunning: false,
        idOnline: {id: ""},
        cells: []
    })
})(angular)
