const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const githubOauthRouter = require('./gh/routes');

const app = express()
const port = 3000

app.set('json spaces', 2);
app.set('view engine', 'ejs');

// app.use(express.static('www'))
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session cookie
app.use(cookieParser());

//session middleware
app.use(sessions({
    secret: "secretsessionkey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.get('/',(req,res) => {
  let session=req.session;
  if(session.userid){
  }else
  res.redirect('/');
});

function login(email, password) {

  return true;
}

app.post('/newuser',(req,res) => {

});

app.post('/login',(req,res) => {

  console.log( req.body );
  if( login(req.body.email, req.body.password)){
      session=req.session;
      session.userid=req.body.email;
      console.log(req.session)
      res.redirect('/');
  }
  else{
      res.send(`Invalid username or password <a href='/'>Retry</a>`);
  }

})

app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

app.use('/gh', githubOauthRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})