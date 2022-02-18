/*
  Leverage Next.js' API routes
*/

import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../../graphql/schema'
import { resolvers } from '../../graphql/resolvers'
import { createContext } from '../../graphql/context'
import Cors from 'micro-cors'

const cors = Cors()

/*
  Instantiation of ApolloServer with defined schema and resolvers
*/
const apolloServer = new ApolloServer({
  schema,
  resolvers,
  context: createContext
})

const startServer = apolloServer.start()  // This is a requirement of Apollo Server 3

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer

  await apolloServer.createHandler({
    path: '/api/graphql',  // endpoint of the graphql api
  })(req, res)
})

/*
  The 'config' object facilitates making changes to the default configs
*/
export const config = {
  api: {
    bodyParser: false,  // Body parsing is disabled here since it is handled by GraphQL
  },
}