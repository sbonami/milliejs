const { millie } = require("./millie")
const app = require("./app")

millie.listen(() => app())
