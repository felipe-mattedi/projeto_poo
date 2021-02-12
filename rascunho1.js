const fs = require('fs')
const input = require('readline-sync')

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
    }
    loginAdminUser(email, password) {
        this.currentAdminCompanyIndex = this.companies.findIndex(company => {
            return company.adminUser.email === email && company.adminUser.password === password
        })
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
}

class AdminUser extends User {
    constructor(object) {
        super(object)
    }
}

let db = new Companies(JSON.parse(fs.readFileSync('db.json').toString()))

// --------- login user

const currentEmail = "pietro.ribeiro@letscode.com.br"
const currentPassword = "12345"

db.loginEmployee(currentEmail, currentPassword) // <-

let user = new Employee(db.companies[db.currentCompanyIndex].employees[db.currentUserIndex])

// --------- login admin

db.loginAdminUser('felipe.paiva@letscode.com.br', 'SENHA123')

let admin = new AdminUser(db.companies[db.currentAdminCompanyIndex].adminUser)

// --------- test

console.log(user)
console.log(admin)