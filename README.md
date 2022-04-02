# Simple Voting Service App
## Backend
### Stand up backend first
Uses Springboot Framework / maven /Rest API
database file = sqlitesample.db

./mvnw clean spring-boot:run

### Frontend
Ionic Angular

npm install
npm run build
ng serve

### Testing with curl

`curl http://localhost:8080/voters`

`curl -X POST  -d '{"name": "Timmy Turtle"}' -H "Content-Type: application/json" http://localhost:8080/voters`

`curl -X PUT "http://localhost:8080/voters/?id=6&question=4"`

`curl -X GET http://localhost:8080/questions/countYes/3`
`curl -X GET http://localhost:8080/questions/countNo/3`


