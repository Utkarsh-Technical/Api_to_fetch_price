const express = require('express');
const app = express();
const reader = require('xlsx');
const file = reader.readFile('./product_list.xlsx');
var url = require('url');
const fetch = require('node-fetch');
const { Parser } = require('json2csv');
const fs = require('fs');

var response_price = [];

function generatecsv(){
    const parseObj = new Parser();
    const csv = parseObj.parse(response_price);
    fs.writeFileSync('./product_list.csv',csv);
}

app.get('/',async(req,res)=>{
    const worksheet = file.Sheets[file.SheetNames[0]];
    const product_code = [];
    for (let z in worksheet) {
        if(z.toString()[0] === 'A'){
            product_code.push(worksheet[z].v);
        }
    }
    // res.send(adr)
    for (i in product_code){
        // i=0 : Removing header line.
        if(i != 0){
            // Append the product code.
            var adr = 'https://api.storerestapi.com/products/' + product_code[i];
            let url = adr;
            const response = await fetch(url);
            const body = await response.json();
            var obj = JSON.parse(JSON.stringify(body));

            // Generate the list of objects 
            response_price.push({
                "product_code" : obj.data.slug,
                "price" : obj.data.price
            })}
    }
    console.log(response_price);
    // JSON to CSV
    generatecsv();
    res.send("Success");
})

app.listen(4000,()=>{
    console.log("listening");
})