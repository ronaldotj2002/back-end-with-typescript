import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import AdminJsSequelize, { Resource } from '@adminjs/sequelize';
import { User } from './models/usuario.entity';
import { Gasto } from './models/gasto.entity';
import { generateResource } from './utils/model';
import { encriptSenha } from './utils/usuario-utils';
import { sequelize } from './db';
require('dotenv').config();
import session from 'express-session';

// const mariaDBStore = require('express-session-mariadb-store')(session);
const mysqlStore = require('express-mysql-session')(session);

AdminJS.registerAdapter({
  Resource: AdminJsSequelize.Resource,
  Database: AdminJsSequelize.Database,
})


const PORT = 3000

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
            return encriptSenha(request);
          }
        },
        edit: {
          before: async (request: any) => {            
            return encriptSenha(request);
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
      authenticate: async (email: string) => {
        const user = await User.findOne({ where: {email}})

        if(user) {
          return user;
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
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })
}

start()