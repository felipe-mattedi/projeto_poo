const fs = require('fs')

// acessar e atualizar banco de dados local

let db = JSON.parse(fs.readFileSync('db.json').toString())
const updateDb = () => fs.writeFileSync('db.json', JSON.stringify(db))

// classes

class User{
  constructor(nome, email){
  this.nome = nome
  this.email = email
  }
}

class Funcionario extends User{
  constructor(nome, email, ponto) {
    super(nome, email)
    this.espelhoPonto = ponto
  }
  	registrarEntrada(){}
    registrarSaida(){}
    recuperarEspelhoPonto(){}
    calcularBancoHoras(){}
}

class Administrador extends User{
  constructor(nome, email, funcionarios){
    super(nome, email)
    this.funcionarios = funcionarios
  
  }
    recuperarEspelhoPonto(funcionario){}
    listarFuncionarios(){}
    cadastrarFuncionario(){}

}


class Empresa {
  constructor(nome,admin,empregados){
    this.nome = nome
    this.admin = admin
    this.empregados = empregados
  }
}

// login loop

let currentEmail = "felipe.paiva@letscode.com.br"
let currentPassword = "senha123"

let currentEmail2 = "pietro.ribeiro@letscode.com.br"
let currentPassword2= "abcde"


let resultado2 = db.companies.filter(function(administrador){
  return (administrador.adminUser.email === currentEmail && administrador.adminUser.password === currentPassword)})

let empresa1 = new Empresa(resultado2[0].name,resultado2[0].adminUser,resultado2[0].employees)

let admin1 = new Administrador(empresa1.admin.name,empresa1.admin.email,empresa1.empregados)


//console.log(admin1)

let resultado3 =  db.companies.reduce(function(estado, colaborador){
   let interno = colaborador.employees.filter(function(funcionario){
    return (funcionario.email === currentEmail2 && funcionario.senha === currentPassword2)
  })
      if(interno.length > 0){
        estado.push(interno)
      } return estado},[])

let funcionario1 = new Funcionario(resultado3[0][0].name, resultado3[0][0].email, resultado3[0][0].attendanceInfo)


