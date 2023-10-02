const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apnacollege'
});



app.get('/', (req, res) => {
    let q1 = 'select * from user';
    try {
        connection.query(q1, (err, user)=> {
            if(err) throw err;
            res.send({user});
        });
    }
    catch(err) {
       console.log(err);
       res.send("some eror in DB...")
    };
})

app.listen(8080, (req, res)=> {
    console.log('app is listening at port 8080.')
});

// let q2 = 'select * from user where '