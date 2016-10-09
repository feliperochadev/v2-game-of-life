package com.feliperocha.gameoflife

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableAsync

@EnableAsync
@SpringBootApplication
class GameOfLifeApplication {

	static void main(String[] args) {
		SpringApplication.run GameOfLifeApplication, args
	}
}
