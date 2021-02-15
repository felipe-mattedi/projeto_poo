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

    updateAttendance(registro){
      if(registro instanceof attendanceInfo){
        this.companies[this.currentCompanyIndex].employees[this.currentUserIndex].attendanceInfo.push(registro)
        this.updateDatabaseFile()
        console.log(`${registro.dict[registro.type]} registrada às ${moment(registro.date).format('HH:mm:ss')}`)
      }
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
        this.horastrabalhadas = {}
        this.diastrabalhados ={}
        this.saldohoras={}
        this.bancoacumulado = 0
    }
    registrarPonto(){

      let data = new Date().toUTCString()
      let type = this.attendanceInfo[this.attendanceInfo.length - 1].type === 'out' ? 'in' : 'out'
      return new attendanceInfo(data,type)   

    }

    recuperarEspelhoPonto(){ 
      var dict = {"in" : "Entrada", "out":"Saída  "}
      console.log(`
------------------------------------
  Registros de ponto do funcionário:
------------------------------------
  ${this.name}
  ${this.email}
------------------------------------
DATA       |    TIPO   |  HORÁRIO`)
      for (let registro of this.attendanceInfo){
      let data = new Date(Date.parse(registro.date))
      let dia = moment(data).format("DD/MM/YYYY")
      let hora = moment(data).format('HH:mm:ss')
      console.log(`${dia} |   ${dict[registro.type]} |  ${hora}`)
      }
  }

    calcularhorastrabalhadas(){

      const size = this.attendanceInfo.length
      for (let k = 0; k < size-1; k+=2){
      let data_entrada = new Date(Date.parse(this.attendanceInfo[k].date))
      let data_saida = new Date(Date.parse(this.attendanceInfo[k+1].date))
      let mes_corrente = moment(data_entrada).format("MM")
      let diferenca = moment.utc(moment(data_saida).subtract(data_entrada))
      this.horastrabalhadas[mes_corrente] = this.horastrabalhadas[mes_corrente] === undefined ? moment.utc("1970-01-01T00:00:00") : this.horastrabalhadas[mes_corrente]
      let qtd_acumulada = this.horastrabalhadas[mes_corrente] 
      this.horastrabalhadas[mes_corrente] = qtd_acumulada + moment(diferenca) 
      }
  }

    calculardiastrabalhados(){

      const size = this.attendanceInfo.length
      for (let k = 0; k < size-1; k+=2){
      let data_entrada = new Date(Date.parse(this.attendanceInfo[k].date))
      let mes_corrente = moment(data_entrada).format("MM")
      let dia_corrente = moment(data_entrada).format("DD")
      this.diastrabalhados[mes_corrente] = (this.diastrabalhados[mes_corrente] === undefined ? [] : this.diastrabalhados[mes_corrente])
      const tamanho = this.diastrabalhados[mes_corrente].length
      if(!(dia_corrente === this.diastrabalhados[mes_corrente][tamanho-1])){
      this.diastrabalhados[mes_corrente].push(dia_corrente)
      }    
    }
  }

    calcularsaldohoras(){
      for (let k in this.horastrabalhadas){
        this.saldohoras[k] = this.horastrabalhadas[k] 
        for(let j=0; j < this.diastrabalhados[k].length; j++){
        this.saldohoras[k] = this.saldohoras[k] - moment.utc("1970-01-01T08:00:00")
      }
    }
  }

    exibebancohoras(){
      console.log(`
-------------------------------------------------
  Banco de horas do funcionário:
-------------------------------------------------
  ${this.name}
  ${this.email}
  ATENÇÃO: A JORNADA DE TRABALHO EH DE 8 HORAS
-------------------------------------------------
    MES     |  SALDO DE HORAS`)
      
      for (let valor in this.saldohoras){
          console.log(`    ${valor}      | ${this.formatahoras(this.saldohoras[valor])}`)
          this.bancoacumulado += this.saldohoras[valor]
      }
  
      console.log(`-------------------------------------------------
  TOTAL DE HORAS ACUMULADAS:
  ${this.formatahoras(this.bancoacumulado)}`)

  }

  formatahoras(milissegundos){
      let saldo = milissegundos/1000
      let total = Math.abs(saldo)
      let sinal = saldo < 0 ? '-' : ' '
     
      let horas = Math.floor(total/3600)
      let minutos = Math.floor((total%3600)/60)
      let segundos = ((total%3600)%60)

      return(`${sinal}${horas} hora(s) ${minutos} minuto(s) e ${segundos} segundo(s)`)

  }

}

class attendanceInfo {
  constructor(date,type){
    this.dict = {'in' : 'Entrada', 'out' : 'Saída'}
    this.date = date
    this.type = type
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

//let admin = db.loginAdminUser('felipe.paiva@letscode.com.br', 'SENHA123')

// --------- test

// console.log(admin.getAllEmployeesNumberedList())

// console.log(admin.getAllEmployeesNumberedList())
// console.log(admin.getSingleEmployeeAttendanceInfo(0))

// dmin.addNewEmployee()
// db.updateDatabaseFile()


// Chamada para registrar ponto

//db.updateAttendance(user.registrarPonto())

// Chamada para recuperar espelho de ponto

//user.recuperarEspelhoPonto()

// Chamadas encadeadas para calcular e exibir banco de horas

user.calcularhorastrabalhadas()
user.calculardiastrabalhados()
user.calcularsaldohoras()
user.exibebancohoras()




// console.log(db.companies[db.currentAdminCompanyIndex].employees)