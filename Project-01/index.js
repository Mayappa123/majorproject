const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();
const path = require('path');
// const file = require('fs')
const methodOverride = require('method-override');
// const upload = multer({dest: 'uploads/'})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage});


app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));

const connection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apnacollege'
});

app.get('/', (req, res) => {
    return res.render('profile.ejs');
})

app.post('/upload', upload.single('ProfileImage'), (req, res)=> {
    console.log(req.body);
    console.log(req.file)
    res.redirect('/');
})

// app.get('/users', (req, res) => {
//     let q1 = 'select * from user';
//     try {
//         connection.query(q1, (err, users)=> {
//             if(err) throw err;
//             res.render('show.ejs', {users});
//         });
//     }
//     catch(err) {
//        console.log(err);
//        res.send("some eror in DB...")
//     };
// });

// app.post('/users/:id/edit', (req, res)=> {
//     let {id} = req.params;
//     q2 = `update user set followers = 500 where id = ${id}`;
//     try {
//         connection.query(q1, (err, result)=> {
//             if(err) throw err;
//             let user = result[0];
//             res.render('edit.ejs', {user})
//         })
//     }
//     catch(err) {
//         console.log(err);
//     }
// });

app.listen(8080, (req, res)=> {
    console.log('app is listening at port 8080.')
});

// let q2 = 'select * from user where '