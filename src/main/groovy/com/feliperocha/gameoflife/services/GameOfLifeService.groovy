package com.feliperocha.gameoflife.services

import com.feliperocha.gameoflife.configurations.GameConfig
import com.feliperocha.gameoflife.domains.Cell
import com.feliperocha.gameoflife.repositories.IdOnlineRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

@Service
class GameOfLifeService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate

    @Autowired
    private IdOnlineRepository idOnlineRepository

    def createNextGeneration(Cell[][] cells) {
        def newGeneration = new Cell[cells.length][cells[0].length]
        cells.each{ cellRow ->
            cellRow.each{ cell ->
                def newCell = new Cell(y: cell.y, x: cell.x, alive: cell.alive)
                newGeneration[cell.y][cell.x] = newCell
                        .checkIfLiveOrDie(newCell, newCell.getNeighbors(newCell, cells))
            }
        }
        newGeneration
    }

    @Async
    void runGame(GameConfig gameConfig) {
        idOnlineRepository.save(gameConfig.idOnline)
        def runStep = { GameConfig gameConfigCurrent ->
            if(gameConfigCurrent.gameRunning)
            {
                gameConfigCurrent.cells = createNextGeneration(gameConfigCurrent.cells)
                gameConfigCurrent.steps--
                gameConfigCurrent.gameRunning = gameConfigCurrent.steps > 0 &&
                        idOnlineRepository.exists(gameConfigCurrent.idOnline.id)
                messagingTemplate.convertAndSend(
                        "/queue/subscribe/$gameConfigCurrent.idOnline.id" as String, gameConfigCurrent)
                sleep(gameConfigCurrent.delay)
                trampoline(gameConfigCurrent)
            }
            else
            {
                deleteGame(gameConfig.idOnline.id)
            }
        }.trampoline()
        runStep(gameConfig)
    }

    void deleteGame(String id) {
        if(idOnlineRepository.exists(id)) {
            idOnlineRepository.delete(id)
        }
    }
}
