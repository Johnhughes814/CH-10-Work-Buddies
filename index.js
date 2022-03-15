const Manager = require ("./lib/Manager")
const Engineer = require ("./lib/Engineer")
const Intern = require ("./lib/Intern")
const path = require ("path") 
const fs = require ("fs")
const inquirer = require("inquirer")
const OUTPUT_DIR = path.resolve(__dirname, "dist")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];
buildTeam()

async function buildTeam() {
    console.log("Good morning! Let's bring some new hires on board!")
    // ALWAYS CREATING A MANAGER TO START
    team.push(await createManager())
    // do creates a loop that executes the statement until the condition is false 
    // do {
    //     statement
    // }
    // while(condition)
    do {
        var nextEmployee = await createNextEmployee();
        if(nextEmployee) {
            team.push(nextEmployee);
        }
    } while (nextEmployee)
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, render(team), "utf-8")
}

async function createManager() {
    let answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the Manager's name?",
            validate: validateNotEmpty
        },
        {
            type: "input",
            name: "id",
            message: "What is your ID number?",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "What is your email?",
            validate: validateEmail
        },
        {
            type: "input",
            name: "officeNumber",
            message: "What is your office number?",
            validate: validatePositiveOfficeNumber
        }
    ])
    return new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
}

async function createNextEmployee(){
    let answers = await inquirer.prompt([
        {
            type:"list",
            name:"next",
            message: "What role would you like to add now?",
            choices: ["Engineer", "Intern", "There is nobody else."]
        }])
        switch (answers.next){
            case "Engineer": return createEngineer()
            case "Intern": return createIntern()
            default: return null
        }
}

async function createEngineer() {
    let answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the Engineer's name?",
            validate: validateNotEmpty
        },
        {
            type: "input",
            name: "id",
            message: "What is your ID number?",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "What is your email?",
            validate: validateEmail
        },
        {
            type: "input",
            name: "gitHub",
            message: "What is your github username??",
            validate: validateNotEmpty
        }
    ])
    return new Engineer(answers.name, answers.id, answers.email, answers.gitHub);
}

async function createIntern() {
    let answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the Intern's name?",
            validate: validateNotEmpty
        },
        {
            type: "input",
            name: "id",
            message: "What is your ID number?",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "What is your email?",
            validate: validateEmail
        },
        {
            type: "input",
            name: "school",
            message: "What school do you go to?",
            validate: validateNotEmpty
        }
    ])
    return new Intern(answers.name, answers.id, answers.email, answers.school);
}

function validateNotEmpty(string) {
    if (string === "") {
      return "Please enter at least one character.";
    } else {
      return true;
    }
  }
  
  function validatePositiveOfficeNumber(string) {
    if (!/^[1-9]\d*$/.test(string)) {
      return "Please enter a positive number greater than zero."
    } else {
      return true;
    }
  }
  
  function validateNumber(string) {
    if (!/^[1-9]\d*$/.test(string)) {
      return "Please enter a positive number greater than zero."
    } else if (team.find((employee) => string === employee.getId())) {
      return "This ID is already taken. Please enter a different number.";
    } else {
      return true;
    }
  }
  
  function validateEmail(string) {
    if (!/\S+@\S+\.\S+/.test(string)) {
      return "Please enter a valid email address.";
    } else {
      return true
    }
  }