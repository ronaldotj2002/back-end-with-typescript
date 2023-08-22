import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import AdminJsSequelize from '@adminjs/sequelize';
import { User } from './models/usuario.entity';
import { Gasto } from './models/gasto.entity';

AdminJS.registerAdapter({
  Resource: AdminJsSequelize.Resource,
  Database: AdminJsSequelize.Database,
})


const PORT = 3000

const start = async () => {
  const app = express()

  const admin = new AdminJS({
    resources: [
      User, Gasto
    ]
  })

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}`)
  })
}

start()