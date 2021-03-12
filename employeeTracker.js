const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// cTable(connection);
const start = () => {
    inquirer
        .prompt({
            name: 'start',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all Employees', 'View all Departments', 'View all Employee Roles',
                'Add an Employee', 'Add a Department', 'Add an Employee Role',
                'Delete an Employee', 'Delete a Department', 'Delete an Employee Role',
                `Update an Employee's role`, `Update an Employee's Manager`, `View Employees by Manager`,
                `View the total utilized budget of a Department`, 'EXIT'],
        })
        .then((answer) => {

        })
}
//     connection.query('DELETE FROM Department WHERE id = 1', (err, res) => {
//       if (err) throw err;
//       console.table(res);
//       connection.end();
//     });
//   };

const AddEmployee = () => {
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
    inquirer
    .prompt([
        {
            name: 'firstName',
            type: 'input',
            message: `What is the new Employee's first name?`
        },
        {
            name: 'lastName',
            type: 'input',
            message: `What is the new Employee's last name?`
        },
        {
            name: 'role',
            type: 'list',
            message: `What is the Employee's role?`,
            choices () {
                const choiceArray = [];
                res.forEach(({ title }) => {
                  choiceArray.push(title);
                });
                return choiceArray;
            }
        },
        {
            name: 'manager',
            type: 'list',
            message: `Who is this new Employee's Manager?`,
            choices () {
                let choiceArray = [];
                connection.query(`SELECT * FROM employee`, (err, res) => {
                    if (err) throw err;
                    res.forEach(({ first_name }) => {
                        choiceArray.push(first_name);
                        
                    });
                    console.log(choiceArray);
                });
                return choiceArray;
            }
        }
    ])
});
}
AddEmployee();