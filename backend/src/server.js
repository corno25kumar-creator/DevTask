import express from 'express'
import dotenv from 'dotenv'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import http from 'http'
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer'
import { resolvers, typeDefs } from './lib/graph_schema/schema.js'
import { connectDb } from './lib/db/index.js'

dotenv.config()

 const app = express()

 const httpServer = http.createServer(app)
 app.use(cors())


const port = process.env.PORT || 3000

const apolloserver = new ApolloServer({
    typeDefs:typeDefs,
    resolvers : resolvers,
    plugins :[ApolloServerPluginDrainHttpServer({httpServer})]
})

async function startServer() {
    try {
         connectDb()
         await apolloserver.start()
        console.log(`server has started`)

      app.use(
  '/graphql',
  express.json(),
  expressMiddleware(apolloserver, {
    context: async ({ req }) => {
      return { req };
    }
  })
)
    app.get('/', (req, res) => {
      res.send('Welcome to my Hybrid API! Go to /graphql')
    })

    await new Promise(resolve =>
      httpServer.listen({ port }, resolve)
    )

    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)

    } catch (error) {
        console.log(`the error has occured in startServer() :- ${error}`)
    }
}

startServer()