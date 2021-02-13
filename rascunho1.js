const fs = require('fs')
const input = require('readline-sync')
const moment = require('moment')

// --------- dados

class Companies {
    constructor(json) {
        Object.assign(this, json);
        this.currentUserIndex
        this.currentCompanyIndex
        this.currentAdminCompanyIndex
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
        return new AdminUser(this.companies[this.currentAdminCompanyIndex].adminUser)
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
}

let db = new Companies(JSON.parse(fs.readFileSync('db.json').toString()))

console.log(db)

// --------- login user

const currentEmail = "lucas.rios@letscode.com.br"
const currentPassword = "52345"

let user = db.loginEmployee(currentEmail, currentPassword)

// --------- login admin

let admin = db.loginAdminUser('felipe.paiva@letscode.com.br', 'SENHA123')

// --------- test

console.log(user)
console.log(admin)
user.recuperarEspelhoPonto()