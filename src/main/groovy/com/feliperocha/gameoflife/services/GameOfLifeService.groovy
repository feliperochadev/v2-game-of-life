package com.feliperocha.gameoflife.services

import com.feliperocha.gameoflife.configurations.GameConfig
import com.feliperocha.gameoflife.domains.Cell
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

@Service
class GameOfLifeService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    def createNextGeneration(Cell[][] cells) {
        def newGeneration = new Cell[cells.length][cells[0].length]
        for (int y = 0; y < cells.length; y++) {
            for (int x = 0; x < cells[y].length; x++) {
                def cell = new Cell(y: cells[y][x].y, x: cells[y][x].x, alive: cells[y][x].alive)
                newGeneration[y][x] = cell.checkIfLiveOrDie(cell, cell.getNeighbors(cell, cells))
            }
        }
        newGeneration
    }

    @Async
    void runGameWS(GameConfig gameConfig)
    {
        while(gameConfig.steps > 0 && gameConfig.gameRunning)
        {
            gameConfig.cells = createNextGeneration(gameConfig.cells)
            gameConfig.steps--
            gameConfig.gameRunning = gameConfig.steps > 0
            messagingTemplate.convertAndSend("/queue/subscribe/$gameConfig.id" as String, gameConfig)
            sleep(gameConfig.delay)
        }
    }
}
