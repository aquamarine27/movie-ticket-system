# Microservices: Movies and Tickets 

## Project Structure

bash
microservices-cinema/
├── docker-compose.yml
├── Cinema_Microservices_API.postman_collection.json
├── movie-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   └── movies.json
└── ticket-service/
├── Dockerfile
├── package.json
├── index.js
└── tickets.json


## First-Time Setup
1. **Requirements**:
   - Docker and Docker Compose [](https://www.docker.com/get-started).
   - Postman [](https://www.postman.com/downloads/).
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/aquamarine27/movie-ticket-system.git
3. **Run the Containers**:
    ```bash
    docker-compose up --build


## Testing with Postman
1. **Import the Collections**:
    ```bash
    In Postman, go to File > Import.
    Select movie-ticket_API.postman_collection.json