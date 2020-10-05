const app = require('./app')
require('./database')

const init = async () => {
    await app.listen(3000)
    console.log(`server on port 3000`)
}

init()