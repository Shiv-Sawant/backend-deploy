const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const FormData = require('form-data')
const axios = require('axios')
// const cors = require('cors')

const port = 9000

// app.use(cors())
app.use("/", async (req, res) => {
    let formData = new FormData();
    try {
        //calculates dates
        const today = new Date();
        const oneMonthAgo = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 2
        );

        const query_date = `${oneMonthAgo.getFullYear()}-${oneMonthAgo.getMonth() + 1
            }-${oneMonthAgo.getDate()}`;
        const end_date = `${today.getFullYear()}-${today.getMonth() + 1
            }-${today.getDate()}`;
        console.log(query_date, end_date, "date")

        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `http://10.20.10.210/admin/AST_cdr_inbound.php?query_date=${query_date}&end_date=${end_date}&group%5B%5D=13&SUBMIT=SUBMIT&DB=`,
            headers: {
                Authorization: "Basic NjY2NjpoYWxvb2NvbQ==",
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: formData
        };


        axios(config).then(async (response) => {
            // const requestOptions = {
            //     method: 'POST',
            //     headers: {
            //         Authorization: "Basic NjY2NjpoYWxvb2NvbQ==",
            //         Accept: "application/json",
            //         "Content-Type": "application/json"
            //     },
            //     body: formData
            // };


            // fetch(`http://10.20.10.210/admin/AST_cdr_inbound.php?query_date=${query_date}&end_date=${end_date}&group%5B%5D=13&SUBMIT=SUBMIT&DB=`, requestOptions).then((data) => {
            const { JSDOM } = require('jsdom')
            console.log(response, "res")
            // Assuming the API response is stored in a variable called 'apiResponse'
            const apiResponse = await response.data;

            const dom = new JSDOM(apiResponse);

            const document = dom.window.document;
            // console.log(document)

            const table = document.querySelector(".table.table-bordered.table-striped");
            // console.log(table)

            const rows = table?.querySelectorAll("tr");
            const dataTwo = [];
            let headers = [];

            rows?.forEach((row, index) => {
                if (index === 0) {
                    // Header row
                    headers = Array.from(row?.querySelectorAll("td")).map((header) =>
                        header.textContent.trim()
                    );
                } else {
                    // Data rows
                    const rowData = {};
                    const cells = row.querySelectorAll("td");

                    cells.forEach((cell, cellIndex) => {
                        rowData[headers[cellIndex]] = cell.textContent.trim();
                    });
                    dataTwo.push(rowData);
                }
            });
            const json = dataTwo;
            res.json(json)
        })




    } catch (err) {
        console.log(err, "err")
    }
})

// app.use('/outbound', async (req, res) => {
//     res.json({ message: "outbound backend" })
//     try {
//         const filter = {};
//         const client = await MongoClient.connect(
//             "mongodb+srv://data_IT:data_IT@apml.6w5pyjg.mongodb.net/test",
//             { useNewUrlParser: true, useUnifiedTopology: true }
//         )
//         const coll = client.db("haloocom").collection('OUT_BOUND');
//         const cursor = coll.find(filter);
//         const result = await cursor.toArray();
//         res.json(result)
//     } catch (err) {
//         console.log(err.message)
//     }
// });

app.listen(port, () => {
    console.log(`deploy backend successfully`)
})

export default app