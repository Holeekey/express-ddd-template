import express from 'express'
import { authRouter } from './auth/infra/routes/auth.router'
import envConfig from './core/infra/env/env-config'
import mongoose from 'mongoose'
import { userRouter } from './user/infra/routes/user.router'
import { MongoCredentialsRepository } from './auth/infra/repository/mongo/credentials.repository'
import { UuidGenerator } from './core/infra/uuid/uuid-generator'
import { RegisterService } from './auth/app/services/register/register.service'
import { JwtGenerator } from './core/infra/jwt/jwt-generator'
import { Sha256Encryptor } from './core/infra/encryptors/sha-256/sha256-encryptor'
import { ExceptionDecorator } from './core/app/decorators/exception.decorator'
import { Role } from './auth/app/models/credentials'

const credentialsRepo = new MongoCredentialsRepository()

const createAdmin = async () => {
  const registerService = new RegisterService(
    new UuidGenerator(),
    new JwtGenerator(),
    new Sha256Encryptor(),
    credentialsRepo
  )
  await new ExceptionDecorator(registerService, () => {
    return new Error('Failed to create admin user')
  }).execute({
    email: envConfig.adminEmail,
    password: envConfig.adminPassword,
    role: Role.ADMIN,
  })
}

console.log('Connecting to database...')

mongoose
  .connect(envConfig.mongoUri)
  .then(async () => {
    console.log('Connected succesfully to database!')

    const credentialsCount = await credentialsRepo.count()

    if (credentialsCount === 0) {
      console.log('Creating admin user...')
      await createAdmin()
      console.log('Admin user created successfully!')
    }

    const app = express()

    app.use(express.json())

    app.use('/auth', authRouter)

    app.use('/user', userRouter)

    app.get('/', (_req, res) => {
      res.send('Welcome to Express-DDD-App!')
    })

    app.listen(envConfig.port, () => {
      console.log(`Listening on port http://localhost:${envConfig.port}`)
    })
  })
  .catch((err) => {
    console.error(err)
  })
