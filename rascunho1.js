const fs = require('fs')
const input = require('readline-sync')
const moment = require('moment')

// --------- main classes

class Companies {
    constructor(jsonFilePath) {
        Object.assign(this, JSON.parse(fs.readFileSync(jsonFilePath).toString()));
        this.currentUserIndex
        this.currentCompanyIndex
        this.currentAdminCompanyIndex
        this.currentFilePath = jsonFilePath
    }
    loginEmployee(email, password) {
        this.currentCompanyIndex = this.companies.findIndex(company => {
            this.currentUserIndex = company.employees.findIndex(employee => employee.email === email && employee.password === password)
            return this.currentUserIndex >= 0
        })
        return new Employee(this.companies[this.currentCompanyIndex].employees[this.currentUserIndex])
    }
    loginAdminUser(email, password) {
        this.currentAdminCompanyIndex = this.companies.findIndex(company => {
            return company.adminUser.email === email && company.adminUser.password === password
        })
        return new AdminUser(this.companies[this.currentAdminCompanyIndex])
    }
    addNewCompany() {
        console.log('Cadastrar nova empresa')
        console.log('----------------------')
        let companyName = input.question('Nome da empresa: ')
        let adminName = input.question('Nome do admin: ')
        let adminEmail = input.question('E-mail do admin: ')
        let adminPassword = input.question('Senha do admin: ')
        let newCompanyObject = {
            name: companyName,
            adminUser: {
                name: adminName,
                email: adminEmail,
                password: adminPassword
            },
            employees: []
        }
        this.companies.push(newCompanyObject)
    }
    updateDatabaseFile() {
        fs.writeFileSync(this.currentFilePath, JSON.stringify({ companies: this.companies }))
    }
}

class User {
    constructor(object) {
        Object.assign(this, object)
    }
    getName() { return this.name }
}

class Employee extends User {
    constructor(object) {
        super(object)
    }
    registrarEntrada(){}
    registrarSaida(){}
    recuperarEspelhoPonto(){ 
        var dict = {"in" : "Entrada", "out":"Saída  "}
        console.log(`Registros de ponto do funcionário:
-------------------------------
  ${this.name}
  ${this.email}
-------------------------------
  DATA   |    TIPO   |  HORÁRIO`)
        for (let registro of this.attendanceInfo){
        let data = new Date(Date.parse(registro.date))
        let dia = moment(data).format('l')
        let hora = moment(data).format('LTS')
        console.log(`${dia} |   ${dict[registro.type]} |  ${hora}`)
        }
    }
}

class AdminUser extends User {
    constructor(object) {
        super(object)
    }
    getAllEmployeesObject() {
        return this.employees
    }
    getAllEmployeesNumberedList() {
        return this.getAllEmployeesObject().reduce((acc, employee, index) => `${acc}\n${index + 1}. ${employee.name}`, '')
    }
    getSingleEmployeeObject(employeeIndex) {
        return new Employee(this.getAllEmployeesObject()[employeeIndex])
    }
    getSingleEmployeeAttendanceInfo(employeeIndex) {
        return this.getSingleEmployeeObject(employeeIndex).recuperarEspelhoPonto()
    }
    addNewEmployee(){
        console.log('Cadastrar novo funcionário')
        console.log('--------------------------')
        let name = input.question('Nome: ')
        let email = input.question('E-mail: ')
        let password = input.question('Senha: ')
        let newEmployeeObject = {
            name: name,
            email: email,
            password: password,
            attendanceInfo: []
        }
        this.employees.push(
            new Employee(newEmployeeObject)
        )
    }
}

// --------- get data from db file

let db = new Companies('db.json')

// --------- login user

const currentEmail = "pietro.ribeiro@letscode.com.br"
const currentPassword = "12345"

let user = db.loginEmployee(currentEmail, currentPassword)

// --------- login admin

let admin = db.loginAdminUser('felipe.paiva@letscode.com.br', 'SENHA123')

// --------- test

// console.log(admin.getAllEmployeesNumberedList())

// console.log(admin.getAllEmployeesNumberedList())
admin.getSingleEmployeeAttendanceInfo(0)

// dmin.addNewEmployee()
// db.updateDatabaseFile()

db.addNewCompany()

console.log(db.companies)

// console.log(db.companies[db.currentAdminCompanyIndex].employees)