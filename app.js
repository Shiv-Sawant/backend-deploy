const express = require('express')
const app = express()

const port = 9000

app.use("/", (req, res) => {
    res.json({message:"hello your backend is ready"})
})

app.listen(port, () => {
    console.log(`deploy backend successfully`)
})