import jsonServer from "json-server"

const server = jsonServer.create()
const router = jsonServer.router("./upstream.json")
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(router)

export default server
