# ezCart Application

A Spring Boot application with React frontend for an e-commerce shopping cart system.

## Prerequisites

- Java 17 or later
- Maven 3.6.3 or later
- Node.js 16.x or later
- npm 8.x or later

## Building the Application

### Backend (Spring Boot)

To build the backend Spring Boot application, run the following command from the project root directory:

```bash
mvn clean package
```

This will:
1. Clean previous build artifacts
2. Compile the Java code
3. Run tests
4. Package the application into an executable JAR file

The JAR file will be created in the `target` directory with a name like `ezcart-0.0.1-SNAPSHOT.jar`.

### Frontend (React)

The React frontend is located in the `frontend` directory. To build the frontend:

```bash
cd frontend
npm install
npm run build
```

This will create an optimized production build of the React application in the `dist` directory.

## Running the Application

### Development Mode

1. **Backend**: Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```

2. **Frontend**: In a separate terminal, start the React development server:
   ```bash
   cd frontend
   npm run dev
   ```
   This will start the frontend on http://localhost:5173

### Production Mode

1. Build the frontend (as shown above)
2. Package the application:
   ```bash
   mvn clean package
   ```
3. Run the JAR file:
   ```bash
   java -jar target/ezcart-0.0.1-SNAPSHOT.jar
   ```

The application will be available at http://localhost:8080

## Build Options

- Skip tests during build:
  ```bash
  mvn clean package -DskipTests
  ```

- Fast build (skip tests and checks):
  ```bash
  mvn clean package -DskipTests -Dcheckstyle.skip=true
  ```

## Project Structure

- `src/` - Backend source code (Java/Spring Boot)
- `frontend/` - Frontend source code (React)
- `target/` - Compiled output and packaged JAR file

## License

[Your License Here]
