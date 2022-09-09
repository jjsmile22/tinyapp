const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const generateRandomString = () => {
  // 6 random alpha numeric characters
  return Math.random().toString(20).substring(2, 8);

};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const { longURL } = req.body;
  const newShortURL = generateRandomString();

  urlDatabase[newShortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${newShortURL}`);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  console.log('id:', req.params.id);
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  console.log('inside delete');
  delete urlDatabase[req.params.id];
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.post("/urls/:id/edit", (req, res) => {
  console.log('inside edit');
  const editedLongURL = req.body.longURL;
  console.log(urlDatabase);
  urlDatabase[req.params.id] = editedLongURL;
  console.log(urlDatabase);
  res.redirect('/urls/');
});

const userDatabaseIsh = {
  'apple@ample.com': {
    email: 'apple@ample.com',
    name: 'apple',
    password: 'orange'
  }
};

const authUser = (email, password) => {
  const currentUser = userDatabaseIsh[email];
  if (!currentUser) {
    console.log('Email Does Not Exist');
    return {err: 'Email Does Not Exist', user: 'null'};
  }

  if (currentUser.password !== password) {
    console.log('Email Does Not Match Password');
    return {err: 'Email Does Not Exist', user: 'null'};
  }

  return {err: null, user: currentUser}

}

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  const {err, user} = authUser(email, password);

  if (err) {
    console.log('error: ', err);
    return res.redirect('/urls');
  }

 
  res.json(user);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});