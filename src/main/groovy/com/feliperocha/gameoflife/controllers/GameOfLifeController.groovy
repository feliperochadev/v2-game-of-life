package com.feliperocha.gameoflife.controllers

import com.feliperocha.gameoflife.configurations.GameConfig
import com.feliperocha.gameoflife.domains.Cell
import com.feliperocha.gameoflife.services.GameOfLifeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
class GameOfLifeController {

    @Autowired
    private GameOfLifeService gameOfLiveService

    @RequestMapping(value="/api/v1/game-of-life", method=RequestMethod.PUT)
    def runTurn(@RequestBody Cell[][] cells){
        gameOfLiveService.createNextGeneration(cells)
    }

    @RequestMapping(value="/api/v2/game-of-life/{id}", method=RequestMethod.POST)
    def startGameWS(@Valid @RequestBody GameConfig gameConfig){
        gameOfLiveService.runGameWS(gameConfig)
    }

    @RequestMapping(value="/api/v2/game-of-life/{id}", method=RequestMethod.DELETE)
    def stopGameWS(@PathVariable(value="id") String id){
        gameOfLiveService.stopGameWS(id)
    }
}
