import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

const server = express();
const PORT = 4000;

dotenv.config();

const db = new pg.Pool ({
    connectionString: process.env.DATABASE_URL
})

server.use(express.static('public'));

server.get('/todo' , (req , res) => {
    db.query('SELECT * FROM test' , []).then(result => {
        res.send(result.rows)
    })
})

server.listen(PORT , ()=> {
    console.log(`Listening on port ${PORT}...`)
})