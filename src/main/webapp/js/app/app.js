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
