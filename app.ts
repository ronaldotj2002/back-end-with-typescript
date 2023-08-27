import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import AdminJsSequelize, { Resource } from '@adminjs/sequelize';
import { User } from './models/usuario.entity';
import { Gasto } from './models/gasto.entity';
import { generateResource } from './utils/model';
import { encriptSenha } from './utils/usuario-utils';
import { sequelize } from './db';
import session from 'express-session';
import bcrypt from 'bcrypt';
import hbs from 'hbs';
import Email from './utils/email';
import dashboard from './routes/dashboard';
require('dotenv').config();

const path = require('node:path');

// const mariaDBStore = require('express-session-mariadb-store')(session);
const mysqlStore = require('express-mysql-session')(session);

AdminJS.registerAdapter({
  Resource: AdminJsSequelize.Resource,
  Database: AdminJsSequelize.Database,
})

const bodyParser = require('body-parser')
const PORT = 3000
const ROOT_DIR = __dirname

const email = new Email(ROOT_DIR)
const start = async () => {
  const app = express()

  sequelize.sync().then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err)
  })

  const admin = new AdminJS({
    resources: [
      generateResource(User, {           
            senha: {
              type: 'password',
              isVisible: {
                add: true, list: false, edit: true, filter: false, show: false
              }            
          }
      }, {
        new: {
          before: async (request: any) => {      
             await email.sendEmail(request.payload.email, 'Bem-vindo ao controle de gastos', 'envio-senha', 
             {text: 'sua senha é: ', nome: request.payload.nome, senha: request.payload.senha})     
            return encriptSenha(request);
          }
        },
        edit: {
          before: async (request: any, context: any) => {    
            console.log("CONTEXT IGUAL: =====> ", context.record.params.senha)
            console.log("SENHA: =====> ", request.payload.senha)
            if(request.method !== 'post') return request
            if(request.payload.senha !== context.record.params.senha) {
              console.log("CONTEXT DIFERENTE: =====> ", context.record.params.senha)
              await email.sendEmail(request.payload.email, 'Senha Alterada', 'envio-senha', 
              {text: 'você alterou a sua senha, agora ela é : ',nome: request.payload.nome, senha: request.payload.senha})     
              return encriptSenha(request);
            }
            return request
          }
        }
        }),
      generateResource(Gasto)
    ],
    rootPath: '/admin',
    dashboard: {
      component: AdminJS.bundle('./components/dashboard.tsx')
    },

    branding: {
      favicon: 'https://w7.pngwing.com/pngs/936/54/png-transparent-finance-financial-management-computer-icons-money-management-cambio-text-trademark-investment-thumbnail.png',
      logo: 'https://w7.pngwing.com/pngs/936/54/png-transparent-finance-financial-management-computer-icons-money-management-cambio-text-trademark-investment-thumbnail.png',
      companyName: "Meus Gastos"
    }
  })

  const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true
  })

  const secret = 'rgGFTRVfiQBTphRR6ZHUefDMCtTKjMgt';
  const cookieName = 'adminjs';

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin, 
    {
      authenticate: async (email: string, senha: string) => {
        const user = await User.findOne({ where: {email}})

        if(user) {
          const comparar = await bcrypt.compare(senha, user.getDataValue('senha'))
          if(comparar) {
            return user;
          }
          return false;
        }
        return false;
      },
      cookieName: cookieName,
      cookiePassword: secret
    },
    null, {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: secret,
      cookie: {
        httpOnly: true,
        secure: false
      },
      name: cookieName
    }
  )

  // const adminRouter = AdminJSExpress.buildRouter(admin)
  hbs.registerPartials(path.join(ROOT_DIR, 'views'))
  app.set('view engine', '.hbs')
  app.use(admin.options.rootPath, adminRouter)
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/dashboard', dashboard)
  
  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })
}

start()