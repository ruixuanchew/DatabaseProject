# Installations:
  1. Install Node.js from the official Node.js Website (https://nodejs.org/en)
  2. Verify installation by running node -v in terminal 
  3. Run npm install in terminal after cloning project. 

# Setting up:
  1. Create a database in your local machine (e.g. MariaDB or mySQL Workbench)
  2. Create a .env file in root folder with the following fields 
  - DB_HOST = <<hostname>>
  - DB_USER = <<username>>
  - DB_PASS = <<password>>
  - DB_NAME = <<database name>>
  3. Execute the .sql file in database

# Running the Application:
  1. Type node server.js in terminal
  2. Copy the link in console (e.g. http://localhost:3000) to a browser

## recipes table: 
   +-----------------+--------------+------+-----+---------+----------------+
  | Field           | Type         | Null | Key | Default | Extra          |
  +-----------------+--------------+------+-----+---------+----------------+
  | recipe_id       | int(11)      | NO   | PRI | NULL    | auto_increment |
  | name            | varchar(255) | NO   |     | NULL    |                |
  | description     | text         | YES  |     | NULL    |                |
  | ingredients     | text         | NO   |     | NULL    |                |
  | ingredients_raw | text         | NO   |     | NULL    |                |
  | serving_size    | varchar(255) | YES  |     | NULL    |                |
  | servings        | int(11)      | NO   |     | NULL    |                |
  | steps           | text         | YES  |     | NULL    |                |
  | tags            | varchar(255) | YES  |     | NULL    |                |
  | search_terms    | varchar(255) | YES  |     | NULL    |                |
  +-----------------+--------------+------+-----+---------+----------------+    

## planners table:
  +-------------+--------------+------+-----+---------+----------------+
  | Field       | Type         | Null | Key | Default | Extra          |
  +-------------+--------------+------+-----+---------+----------------+
  | planner_id  | int(11)      | NO   | PRI | NULL    | auto_increment |
  | user_id     | int(11)      | NO   | MUL | NULL    |                | FK
  | recipe_id   | int(11)      | YES  | MUL | NULL    |                | FK
  | title       | varchar(255) | YES  |     | NULL    |                |
  | description | text         | YES  |     | NULL    |                |
  | time        | varchar(50)  | YES  |     | NULL    |                |
  | date        | varchar(50)  | YES  |     | NULL    |                |
  +-------------+--------------+------+-----+---------+----------------+

## users table:
  +----------+--------------+------+-----+---------+----------------+
  | Field    | Type         | Null | Key | Default | Extra          |
  +----------+--------------+------+-----+---------+----------------+
  | user_id  | int(11)      | NO   | PRI | NULL    | auto_increment |
  | username | varchar(255) | NO   |     | NULL    |                |
  | email    | varchar(255) | NO   |     | NULL    |                |
  | password | text         | NO   |     | NULL    |                |
  +----------+--------------+------+-----+---------+----------------+

## nutrition table:
  +--------------+--------------+------+-----+---------+----------------+
  | Field        | Type         | Null | Key | Default | Extra          |
  +--------------+--------------+------+-----+---------+----------------+
  | nutrition_id | int(11)      | NO   | PRI | NULL    | auto_increment |
  | food         | varchar(255) | YES  |     | NULL    |                |
  | measure      | varchar(255) | YES  |     | NULL    |                |
  | grams        | int(11)      | YES  |     | NULL    |                |
  | calories     | int(11)      | YES  |     | NULL    |                |
  | protein      | int(11)      | YES  |     | NULL    |                |
  | fat          | int(11)      | YES  |     | NULL    |                |
  | fiber        | int(11)      | YES  |     | NULL    |                |
  | carbs        | int(11)      | YES  |     | NULL    |                |
  | category     | varchar(255) | YES  |     | NULL    |                |
  +--------------+--------------+------+-----+---------+----------------+

# Important Login Details
Admin: Register account with email = admin@admin.com, to access admin dashboard

# Understanding the code
## 1. Query Codes 
- /models/: Contains our queries for different tables (e.g. nutritionDB.js, plannerDB.js, recipeDB.js, userDB.js)

## 2. API Calls
- /routes/: Contains the API call to our queries (e.g. routePlanner.js, routeNutrition.js, routeRecipe.js, routeUser.js)

## 3. Frontend Call of Queries
- /public/js/: Contains most of our frontend communication with database. It also contains dynamic loading and other logic.

## 4. Frontend Design
- /public/: HTML files contain all our design for website
- /public/css/styles.css: Contains our styling of website

## 5. Server Logic
- server.js: Contains route declaration, sessions, port details, and more.

## 6. Database Logic
- /js/db.js: Contains details required to connect to database 
