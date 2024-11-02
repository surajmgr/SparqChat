# SparqChat

## Features
- Secure Express backend
- React frontend with Vite (if selected)
- Docker support
- CI/CD pipeline
- Environment-based configurations

## Setup
1. Clone the repository
2. Run `npm install` in both server and client directories
3. Configure environment variables
4. Run `npm run dev` to start development mode

## Scripts
- `npm run dev`: Start the server in development mode
- `npm run start`: Start the server in production mode
- `npm run lint`: Lint the code
- `npm run test`: Run tests

To start the frontend, run `npm run dev` in the client directory
To build the Docker image, run `docker build -t SparqChat .` in the root directory
To run the Docker container, run `docker run -p 5000:5000 SparqChat`
To run CI/CD pipeline, push changes to the repository

Happy coding!
