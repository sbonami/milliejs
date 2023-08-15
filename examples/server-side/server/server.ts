import jsonServer from "json-server"
import app from "./app"

const server = jsonServer.create()
const router = jsonServer.router("./upstream.json")
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use((req: any, res: any, next: any) => {
  res.on("finish", () => {
    app(req, res)
  })
  next()
})

server.use(router)

export default server
