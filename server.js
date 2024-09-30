const express = require('express')
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')


dotenv.config()


//creating connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//test the connection

db.connect((err)=>{
    if(err){
        console.log('Error connecting to the database', err)
    }else{
        console.log('Successfully connected to the database')
    }
})

app.listen(3300, ()=>{
    console.log('server running on port 3300')
})

//Retrieve all patients
app.get('/all_patients', (req, res)=>{
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, data)=>{
        if(err){
            
            res.send('Error retrieving data from the database')
        }
        res.json(data)
    })
})

//Retrieve all providers
app.get('/all_providers', (req, res)=>{
    const sql = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers

    `


    db.query(sql, (err, data)=>{
        if(err){
            
            res.send('Error retrieving data from the database')
        }
        res.json(data)
    })
})

//Filter patients by First Name
app.get('/patients_firstname', (req, res)=>{
    const firstname = req.query.first_name;

    if(!firstname){
        return res.status(400).send('Error! first name is require')
    }
    const sql = `
    SELECT patient_id, first_name, last_name, date_of_birth 
    FROM patients WHERE first_name = ?`

    db.query(sql, [firstname], (err, data)=>{
        if(err){
            console.err('Error retrieving data from the database', err)
            return res.status(500).send('Database query error')
        }

        if(data.length === 0){
            return res.status(404).send(`No patient found with name ${firstname} found` )
        }

        res.send(data)
       
    })
})

//Retrieve all providers by their specialty

app.get('/providers_by_specialty', (req, res) => {
    const specialty = req.query.specialty;

    
    if (!specialty) {
        return res.status(400).send('error: Specialty is required');
    }

   
    const sql = `
    SELECT provider_id, first_name, last_name, provider_specialty 
    FROM providers WHERE provider_specialty = ?`;

    db.query(sql, [specialty], (err, data) => {
        if (err) {
            console.error('Error retrieving data from the database', err);
            return res.status(500).send('error: Database query error');
        }

        
        if (data.length === 0) {
            return res.status(404).send(`message: No providers found with specialty ${specialty}`);
        }

        
        res.send(data);
    });
});
