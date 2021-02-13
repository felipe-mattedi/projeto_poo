const fs = require('fs')
const input = require('readline-sync')

// --------- main classes

class Companies {
    constructor(jsonFilePath) {
        Object.assign(this, JSON.parse(fs.readFileSync(jsonFilePath).toString()));
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
        return new AdminUser(this.companies[this.currentAdminCompanyIndex])
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
        return this.getSingleEmployeeObject(employeeIndex).attendanceInfo
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

// console.log(user)
console.log(admin.getAllEmployeesNumberedList())
console.log(admin.getSingleEmployeeAttendanceInfo(0))
