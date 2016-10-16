# Conway's Game of Life Version 2

##Demo: 
https://v2-gameoflife-feliperocha.herokuapp.com/

##Stack:
Back-end: Groovy, Gradle and Spring with Spring Boot in a REST approach and using Web Socket.

Front-end: HTML5/CSS/JS with AngularJS 1.5.x, Bootstrap 3.x, Stomp, SockJS and Browserify.

Tests: SpringBootTest.

##Requirements:
JDK 1.8.

Groovy 2.4.7.

npm and gulp

To update npm packages run:
```
npm install
```
To change javascript files and generate new index.js file run:
```
gulp
```
You can also run a watcher to update automatily the index.js:
```
gulp watch
```

##How to Run Tests:
```
./gradlew test
```

##How to Run:
```
./gradlew bootRun
```

Go to http://localhost:9999
