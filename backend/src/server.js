const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const app = express()

app.use(cors())
app.use(express.json())

const swaggerDocument = YAML.load('./docs/swagger.yaml')
const authRoutes = require('./modules/auth/routes')
const adminRoutes = require('./modules/admin/routes')
const certificatesRoutes = require('./modules/certificates/certificates.routes')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/certificates', certificatesRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de Atestados Médicos rodando.' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})