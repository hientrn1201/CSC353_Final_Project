# Rate My College Food

## Project Structure

```
Rate-My-College-Food/
|-- server/
|   |-- (backend codes)
|   |-- db/
|       |-- (files related to ER model, data schema, raw data, and populate-data python script)
|-- client/
|   |-- (frontend codes)
```

## Setup Instructions

### Prerequisites

- Python installed
- Node.js and npm installed
- MySQL server installed

### Backend Setup

1. Install the required Python package:
   ```bash
   pip install mysql-connector
   ```
2. Navigate to the `server/db` directory:
   ```bash
   cd server/db
   ```
3. Install the npm packages for the server:
   ```bash
   npm install
   ```
4. Update database credentials in `populate-food.py` with your MySQL server credentials.
5. Run the script to populate the data:
   ```bash
   python populate-food.py
   ```

### Frontend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the npm packages for the server:
   ```bash
   npm install
   ```
3. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
4. Install the npm packages for the client:
   ```bash
   npm install
   ```
5. Update database credentials in `client/api/FoodFinder.js` with your MySQL server credentials.

### Running the Application

1. Start the server. Navigate to the `server` directory:
   ```bash
   npm run start
   ```
2. Start the client. Navigate to the `client` directory:

   ```bash
   npm run start
   ```

3. If there are no errors, the application will run at [http://localhost:3000](http://localhost:3000).

Now, you can access the Rate My College Food application locally. Enjoy exploring and rating college food!
