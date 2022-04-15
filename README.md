# Simple Voting Service App
## Backend
### Stand up backend first
Uses Springboot Framework / maven /Rest API
database file = sqlitesample.db

./mvnw clean spring-boot:run

### Frontend
Ionic Angular - node.js

npm install
npm run build
ng serve

### Testing with curl

`curl http://localhost:8080/voters`

`curl http://localhost:8080/questions`

`curl -X POST  -d '{"name": "Timmy Turtle"}' -H "Content-Type: application/json" http://localhost:8080/voters`

`curl -X PUT -d '{"name": "Timmy Turtle", "question": 55} "http://localhost:8080/voters -H "Content-Type: application/json`

`curl -X GET http://localhost:8080/questions/countYes/3`
`curl -X GET http://localhost:8080/questions/countNo/3`


