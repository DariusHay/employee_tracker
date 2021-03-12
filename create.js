const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const department = () => {
    connection.query(`CREATE TABLE Department (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(30), PRIMARY KEY(id)); `, 
    (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
});
};
const role = () => {
    connection.query(`CREATE TABLE role (id INT NOT NULL AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL (10, 10), department_id INT(30), PRIMARY KEY(id)); `, 
    (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
});
};
const employee = () => {
    connection.query(`CREATE TABLE employee (id INT NOT NULL AUTO_INCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT(30), manager_id INT(30), PRIMARY KEY(id)); `, 
    (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
});
};

// connection.connect((err) => {
//     if (err) throw err;
//     console.log(`connected as id ${connection.threadId}`);
//    employee();
// });
const afterConnection = () => {
    connection.query('SELECT * FROM Department', (err, res) => {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  };

  afterConnection();