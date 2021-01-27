const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const Jest = require('jest');
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = [];
const employeeArr = [];
const managerArr = [];
const engineerArr = [];
const internArr = [];

//Whenever we call the render function that we are getting from our library we will use it as such: render(employeArr)
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


function managerData() {
    inquirer.prompt([
        {   
            type: "input",
            message: "Who is the manager?",
            name: "managerName"
        },
        {   
            type: "input",
            message: "What is the manager's ID?",
            name: "managerID"
        },
        {   
            type: "input",
            message: "What is the manager's email address?",
            name: "managerEmail"
        },
        {
            type: "input",
            message: "What is the manager's office number?",
            name: "officeNumber"
        }]).then(managerAnswers => {
            manager = new Manager(managerAnswers.managerName, managerAnswers.managerID, managerAnswers.managerEmail, managerAnswers.officeNumber);
            teamTitle = managerAnswers.teamTitle;
            console.log("Now we will ask for employee information.")
            lesserEmployeeData();
        });
}

function lesserEmployeeData() {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "What is this employee's role?",
                name: "employeeRole",
                choices: ["Intern", "Engineer", "Manager"],
                // validate property to check that the user provided a value
                validate: (value) => { if(value){return true} else {return 'i need a value to continue'}},
            },            
            {
                type: 'input',
                message: "What is the employee name?",
                name: "employeeName",
                // validate property to check that the user provided a value
                validate: (value) => { if(value){return true} else {return 'i need a value to continue'}},
            },
            {
                type: 'input',
                message: "What is the employee ID number?",
                name: "employeeId",
                // validate property to check that the user provided a value
                validate: (value) => { if(value){return true} else {return 'i need a value to continue'}},
            },
            {
                type: 'input',
                message: "What is the employee email address?",
                name: "employeeEmail",
                // validate property to check that the user provided a value
                validate: (value) => { if(value){return true} else {return 'i need a value to continue'}},
            },
            {
                type: "input",
                message: "What is the Engineer's Github?",
                name: "github",
                when: (userInput) => userInput.employeeRole === "Engineer"
            },
            {
                type: "input",
                message: "What is the Interns school?",
                name: "school",
                when: (userInput) => userInput.employeeRole === "Intern"
            },
            {
                type: "confirm",
                name: "newEmployee",
                message: "Would you like to add another team member?" 
                // if yes, go back again. If no, renderHTML
            }
        ]).then(answers => {
            if (answers.employeeRole === "Intern") {
                const employee = new Intern(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.school);
                teamMembers.push(employee);
            } else if (answers.employeeRole === "Engineer") {
                teamMembers.push(new Engineer(answers.employeeName, answers.employeeId, answers.employeeEmail, answers.github));
            }
            if (answers.newEmployee === true) {
                lesserEmployeeData();
            } else {
                let main = fs.readFileSync('./templates/main.html', 'utf8');
                main = main.replace(/{{teamTitle}}/g, teamTitle);

                // Loop through employees to print out all of their cards without replacing a previous one.
                let managerCard = fs.readFileSync('./templates/Manager.html', 'utf8');
                managerCard = managerCard.replace('{{name}}', manager.getName());
                managerCard = managerCard.replace('{{role}}', manager.getRole());
                managerCard = managerCard.replace('{{id}}', manager.getId());
                managerCard = managerCard.replace('{{email}}', manager.getEmail());
                managerCard = managerCard.replace('{{officeNumber}}', manager.getOfficeNumber());

                var cards = managerCard; // Initial cards only has the Manager card info.
                for (var i = 0; i < teamMembers.length; i++) {
                    var employee = teamMembers[i];
                    // Cards adds and then equals every new employee card info.
                    cards += renderEmployee(employee);
                }
    
                // Adds cards to main.html and outputs to team.html.
                main = main.replace('{{cards}}', cards);
    
                fs.writeFileSync("team.html", htmlRenderer(res), err => {
                    if (err) throw err;
                });
    
                // Confirming that the team.html has been generated
                console.log("The team.html has been generated!");
            }
        });
    }
    
function renderEmployee(employee) {
    if (employee.getRole() === "Intern") {
        var internCard = fs.readFileSync('./templates/Intern.html', 'utf8');
        internCard = internCard.replace('{{name}}', employee.getName());
        internCard = internCard.replace('{{role}}', employee.getRole());
        internCard = internCard.replace('{{id}}', employee.getId());
        internCard = internCard.replace('{{email}}', employee.getEmail());
        internCard = internCard.replace('{{school}}', employee.getSchool());
        return internCard;
    } else if (employee.getRole() === "Engineer") {
        var engineerCard = fs.readFileSync('./templates/Engineer.html', 'utf8');
        engineerCard = engineerCard.replace('{{name}}', employee.getName());
        engineerCard = engineerCard.replace('{{role}}', employee.getRole());
        engineerCard = engineerCard.replace('{{id}}', employee.getId());
        engineerCard = engineerCard.replace('{{email}}', employee.getEmail());
        engineerCard = engineerCard.replace('{{github}}', employee.getGithub());
        return engineerCard;
    }
}
    
managerData();
