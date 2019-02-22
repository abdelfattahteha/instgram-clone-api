## Instgram Api
Node.js api that clones social networks like facebook &amp; instgram
- Frontend app compitable with this api [Frontend Respository](https://github.com/abdelfattahteha/instgram-frontend-angular).

## About App

Node.js app with Express framework using MongoDB with mongoose api.
Using WebSockets to real-time updates

## Setup
1- run `npm install` to install all dependencies.

2- Edit database configurations in app.js, it has its own configuration you can leave it by default or change to 
another database, be sure you installed MongoDB on your machine
```javascript
// connect to MongoDB
mongoose
    .connect(`mongodb://localhost/instgramapp`)
    .then( () => { console.log("Database connected successfully...")})
    .catch( err => console.log("Database connection error..."));
```

3- run `npm start` app will be work on `localhost` on port `3000`, url `http://localhost:3000`

## Compatible with front
1- you can ckeck this api with post man

2- OR use angular-frontend app compitable with this api [Frontend App](https://github.com/abdelfattahteha/instgram-frontend-angular).
