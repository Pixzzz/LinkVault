const express = require('express')
const dotenv = require('dotenv')
const app = express()
const port = 3000

dotenv.config()
console.log(process.env)
app.use(express.json())

app.get('/', (req,res) => {
    res.json({message: 'Hello World, this backend working for LinkVault'})
})
app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})
