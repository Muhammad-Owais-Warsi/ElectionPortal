# E-Election Portal

## Description
This project aims to provide a very user-friendly voting interface to vote the Class Representatives(CR's) of respective Department and Section. The system also tracks votes and presents results accordingly.
This project uses Nodejs and Expressjs as backend and MySQL as the databases.

## Installation
To use this project locally, follow these steps:

1. Clone the repository to your local machine:
    ```bash
    
    git clone https://github.com/Muhammad-Owais-Warsi/ElectionPortal.git
    
    ```
2. Navigate to the project directory:
    ```bash
    cd ElectionPortal
    ```
3. Installing the dependencies:
    ```bash
    npm i
    ```
   
3. Set up the database with required tables and columns:
    ## As this project is in the starting age, you have to setup some changes given below.
    - Create the database named "test" and password as "1234" if you want you can change it in test.js file.
    - You have to create a cr_test_table with with fields RegNo,Names,Dept,Section,votinPercent
    - For now we have jsut added 3 sections only A,B and F.

## Usage
1. Start the application locally by running:
    ```bash
    nodemon test.js
    ```
    or
   ```bash
    node test.js
    ```
   
3. Access the application via your browser at `http://localhost:8001`.
4. Follow the on-screen instructions to vote for candidates in different sections.
5. Submit your votes at the end.

## Technologies Used
- Node.js
- Express.js
- MySQL
- EJS

## Contributors
- [Muhammad Owais Warsi](https://github.com/Muhammad-Owais-Warsi)
- [Deboneil Bhattacharjee](https://github.com/deboneil07)
- [Nitin Dixit](https://github.com/nitindixit03)

