package com.feliperocha.gameoflife.configurations

import com.feliperocha.gameoflife.domains.Cell
import org.hibernate.validator.constraints.NotEmpty
import javax.validation.constraints.Min
import javax.validation.constraints.NotNull

class GameConfig {

    @NotNull
    String id

    @NotNull
    Integer steps

    @NotNull @Min(100l)
    Integer delay

    Integer columns

    Integer rows

    @NotNull
    Boolean gameRunning

    @NotNull @NotEmpty
    Cell[][] cells
}
