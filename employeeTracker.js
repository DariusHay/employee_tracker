const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const cTable = require('console.table');
const util = require('util');
const { type } = require('os');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.query = util.promisify(connection.query);
const start = () => {
    inquirer
        .prompt({
            name: 'option',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all Employees', 'View all Departments', 'View all Employee Roles',
                'Add an Employee', 'Add a Department', 'Add an Employee Role',
                'Delete an Employee', 'Delete a Department', 'Delete an Employee Role',
                `Update an Employee's role`, `Update an Employee's Manager`, `View Employees by Manager`,
                // `View the total utilized budget of a Department`, 
                'EXIT'],
        })
        .then((answer) => {
            switch (answer.option) {
                case 'View all Employees':
                    viewEmployees();
                    break;
                case 'View all Departments':
                    viewDepartments();
                    break;
                case 'View all Employee Roles':
                    viewRoles();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add an Employee Role':
                    addRole();
                    break;
                case 'Delete an Employee':
                    deleteEmployee();
                    break;
                case `Update an Employee's role`:
                    updateRole();
                    break;
                case 'Delete an Employee Role':
                    deleteRole();
                    break;
                case 'Delete a Department':
                    deleteDepartment();
                    break;
                case `Update an Employee's Manager`:
                    updateManager();
                    break;
                case `View Employees by Manager`:
                    viewByManager();
                    break;
                case `View the total utilized budget of a Department`:
                    break;
                default: process.exit();

            }
        })
}

const viewEmployees = async () => {
    const employees = await connection.query('SELECT * FROM employee')
    console.table(employees);
    start();
};
const viewDepartments = async () => {
    const departments = await connection.query('SELECT * FROM Department')
    console.table(departments);
    start();
};
const viewRoles = async () => {
    const roles = await connection.query('SELECT * FROM role')
    console.table(roles);
    start();
}

const addEmployee = async () => {
    // console.log('hello');
    const roleArray = [];
    const managerArray = [];
    const roles = await connection.query(`SELECT * FROM role`)
    const managers = await connection.query(`SELECT * FROM employee`)

    roles.forEach(({ id }) => {
        roleArray.push(id);
    });
    managers.forEach(({ id }) => {
        managerArray.push(id);
    });

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
                choices: roleArray
            },
            {
                name: 'manager',
                type: 'list',
                message: `What is this new Employee's Manager id?`,
                choices: managerArray
            }
        ])
        .then(answers => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.role,
                    manager_id: answers.manager
                })
            viewEmployees();
        });
};

const addDepartment = () => {
    inquirer
        .prompt({
            name: 'department',
            type: 'input',
            message: 'What is the name of the Department you would like to add?'
        })
        .then(answer => {
            const department = answer.department.charAt(0).toUpperCase() + answer.department.slice(1);
            connection.query(
                'INSERT INTO Department SET ?',
                {
                    name: department
                })
            viewDepartments();
        })
}

const addRole = async () => {
    const departmentIds = [];
    const departments = await connection.query(`SELECT * FROM Department`);
    departments.forEach(({ id }) => {
        departmentIds.push(id);
    });

    inquirer
        .prompt([{
            name: 'title',
            type: 'input',
            message: 'What is the role you would like to add?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this employee role?'
        },
        {
            name: 'dptId',
            type: 'list',
            message: 'Pleaase choose a department id for this employee role.',
            choices: departmentIds,
        }
        ])
        .then(answers => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.dptId,
                })
            viewRoles();
        })
}

const deleteEmployee = async () => {
    const emps = [];
    const employees = await connection.query(`SELECT * FROM employee`)
    employees.forEach(({ first_name }) => {
        emps.push(first_name)
    })

    inquirer
        .prompt({
            name: 'delete',
            type: 'list',
            message: 'Which Employee would you like to delete?',
            choices: emps
        })
        .then(answer => {
            connection.query('DELETE FROM employee WHERE ?', {
                first_name: answer.delete
            });
            console.log(`${answer.delete} is no longer an employee`);
            viewEmployees();
        })
}
const deleteRole = async () => {
    const titles = [];
    const roles = await connection.query(`SELECT * FROM role`)
    roles.forEach(({ title }) => {
        titles.push(title)
    })

    inquirer
        .prompt({
            name: 'delete',
            type: 'list',
            message: 'Which Employee role would you like to delete?',
            choices: titles
        })
        .then(answer => {
            connection.query('DELETE FROM role WHERE ?', {
                title: answer.delete
            });
            console.log(`${answer.delete} is no longer an employee role in this company.`);
            viewRoles();
        })
}
const deleteDepartment = async () => {
    const departments = [];
    const department = await connection.query(`SELECT * FROM Department`)
    department.forEach(({ name }) => {
        departments.push(name)
    })

    inquirer
        .prompt({
            name: 'delete',
            type: 'list',
            message: 'Which Department would you like to delete?',
            choices: departments
        })
        .then(answer => {
            connection.query('DELETE FROM Department WHERE ?', {
                name: answer.delete
            });
            console.log(`${answer.delete} is no longer a Department in this company.`);
            viewRoles();
        })
}

const updateRole = async () => {
    const roleArray = [];
    const emps = [];
    const roles = await connection.query(`SELECT * FROM role`);
    const employees = await connection.query(`SELECT * FROM employee`)

    roles.forEach(({ id }) => {
        roleArray.push(id);
    });
    employees.forEach(({ first_name }) => {
        emps.push(first_name)
    })
    inquirer
        .prompt([{
            name: 'employee',
            type: 'list',
            message: "Please choose the employee who's role you want to update.",
            choices: emps
        },
        {
            name: 'role',
            type: 'list',
            message: 'Please select a new role id for this employee',
            choices: roleArray
        }
        ])
        .then(answers => {
            connection.query('UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: answers.role
                    },
                    {
                        first_name: answers.employee
                    }
                ]);
            viewEmployees()
            console.log(`${answers.employee}'s employee role id has been updated to ${answers.role}.`);
        })
}
const updateManager = async () => {
    const emps = [];
    const managerIds = [];
    const employees = await connection.query(`SELECT * FROM employee`)
    employees.forEach(({ first_name }) => {
        emps.push(first_name)
    })
    employees.forEach(({ id }) => {
        managerIds.push(id)
    });
    inquirer
        .prompt([
            {
                name: 'update',
                type: 'list',
                message: 'Please choose an Employee to update their manager.',
                choices: emps
            },
            {
                name: 'manager',
                type: 'list',
                message: `Please choose this Employee new manager's id.`,
                choices: managerIds
            }
        ])
        .then(answers => {
            connection.query('UPDATE employee SET ? WHERE ?',
                [
                    {
                        manager_id: answers.manager
                    },
                    {
                        first_name: answers.update
                    }
                ]);
            viewEmployees()
            console.log(`${answers.update}'s new Manager has an id of ${answers.manager}.`);
        })

}
const viewByManager = async () => {
    const managerIds = [];
    const employees = await connection.query(`SELECT * FROM employee`)
    employees.forEach(({ id }) => {
        managerIds.push(id)
    });
    inquirer
        .prompt([
            {
                name: 'manager',
                type: 'list',
                message: `Please choose this Manager's id whose employees you would like to view.`,
                choices: managerIds
            }
        ])
        .then(answers => {
            connection.query(`SELECT * FROM employee WHERE manager_id = ${answers.manager}`, (err, res) => {
                if (err) throw err;
                console.log(`These are the Employees of the Manager you chose.`);
                console.table(res);
                start();
            })
        })
}

connection.connect((err) => {
    if (err) throw err;
    start();
});