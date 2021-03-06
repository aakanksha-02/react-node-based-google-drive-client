var express = require('express');
const cors = require('cors');
const mysql = require('mysql');
var opn = require('opn');
var redis = require('redis');
var Readable = require('stream').Readable
const {google} = require('googleapis');
const app = express();
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.appdata','https://www.googleapis.com/auth/drive'];

const auth = {"installed":{"client_id":"275400908677-jp3q4k5rn32q6lp72kigvsk6rcvf9jb6.apps.googleusercontent.com","project_id":"quickstart-1549564581878","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"JV2rur8bFOVAQL572go0jm6o","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}

var router = express.Router();
app.use(cors());

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'akki'
});
connection.connect(err=>{
  return err;
});

var client = redis.createClient(); // this creates a new client
REDIS_PASSWORD = ''
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379

const url = 'redis://:'+ REDIS_PASSWORD +'@'+REDIS_HOST +':6379/0'
const redis_client = redis.createClient({url:url})

redis_client.on('connect', () => {
  global.console.log("redis connected");
});    

redis_client.on('error', ()=>{
  global.console.log("Error in connection to the redis");
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Adding login details in Database for keeping track of all the logins.
router.get('/adduser', cors(), function(req, res, next){
  console.log("adding user to database")
  const { name, email, provider, provider_id, provider_pic, token } = req.query
  const insert = `INSERT INTO users(email, name, provider, provider_id, provider_pic, token) VALUES('${email}','${name}','${provider}','${provider_id}','${provider_pic}','${token}')`;
  connection.query(insert, (err, results)=>{
    console.log("inserting into db");
    if(err){
      console.log(err);
      res.send(err);
    }else{
      res.json({
        data: results
      })
    }
  })
  console.log(name);
})

// get all the users from database
router.get('/users', cors(), function(req, res, next){
  const select = "SELECT * FROM users";
  connection.query(select, (err, results)=>{
    if(err){
      res.send(err);
    }else{
      res.json({
        data: results
      })
    }
  })
});

router.post('/upload', function(req, res, next){
  authorize(auth, false, "", req.body['email'], req.body, uploadFiles).then(resp => {
    //console.log(resp.status)
    res.send(resp)
  });
});

// delete file from google drive
router.get('/delete', cors(), function(req, res, next){
  const { id, email } = req.query
  authorize(auth, false, id, email, "hi", deleteFiles).then(resp => {
    if(resp.error){
      res.json({data:resp.errors})
    }else if(resp.data){
      res.json({data : {message: resp.data}})
    }else{
      res.json({data: {message: "File has been deleted..."}})
    }
  });
});

// Authentication for google drive
router.get('/authenticate', cors(), function(req, res, next){
  const { email } = req.query
  authorize(auth, true, "", email, "hi", listFiles).then(files => {
    res.send("authenticated")
  });
});

// Searching file in google drive
router.get('/searching', cors(), function(req, res, next){
  const { successCode, email } = req.query
  authorize(auth, false, successCode, email, "hi", listFiles).then(files => {
    res.send(files)
  });
});

const authorize = (credentials, drive, code, email, body, callback) => {
  return new Promise((resolve, reject) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    redis_client.get(email, (err, token)=>{
      if (err || token==null) {
        console.log("No token exists");
        getAccessToken(oAuth2Client, drive, code, email, body, callback).then(files => {
          resolve(files)
        });
      } else {
        console.log("Found Previous Token")
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, code, body).then(resp => {
          resolve(resp)
        })
        .catch(error => {
          console.log("In the error block")
          console.log(error)
          reject(error)
        })
      }

    });
  })
}

const getAccessToken = (oAuth2Client, drive, code, email, body, callback) => {
  return new Promise((resolve, reject) => {
    console.log("Authenticating....")
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:');

    // remove this drive conditio if possible
    if(drive){
      opn(authUrl)
    } 
    if (drive){
      // put reject instead of return 
      return console.error("create token");
    }

    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token');
        reject('Error retrieving access token', err) 
      }
      oAuth2Client.setCredentials(token);
      redis_client.psetex(email, token['expiry_date'], JSON.stringify(token), (err, resp)=>{
        if(err){
          console.log(err)
        }else{
          console.log(resp)
        }
      });
      callback(oAuth2Client, code, body).then(files => {
        resolve(files)
      })
      .catch(error => {
        console.log("In the error block")
        console.log(error)
        reject(error)
      })
    });
  })
}

const listFiles = (auth, code, body) => {
  return new Promise((resolve, reject) => {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(webContentLink, webViewLink, thumbnailLink, id, name)',
    }, (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject("No files found")
      } 
      const files = res.data.files;
      console.log(res.data)
      if (files.length) {
        console.log('Files:');
        console.log("Got the data from drive. Returning....")
        console.log(files)
        resolve(res.data)
      } else {
        console.log('No files found.');
        reject("No files found")
      }
    });
  });
};

const uploadFiles = (auth, code, body) => {
  return new Promise((resolve, reject) => {

    const imgBuffer = Buffer.from(body['file'], 'base64')
    var s = new Readable()
    s.push(imgBuffer)   
    s.push(null)

    const drive = google.drive({version: 'v3', auth});
    var fileMetadata = {
      'name': body['name']
    };
    var media = {
      mimeType: body['type'],
      body: s
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject("No files found")
      } else{
        resolve(res.status)
      }
    });
  });
};

const deleteFiles = (auth, id, body) => {
  return new Promise((resolve, reject) => {
    const drive = google.drive({version: 'v3', auth});
    drive.files.delete({
      fileId : id
    }, (err, res) => {
      if (res) {
        resolve(res)
      } else {
        console.log('No files found.');
      }
      if (err) {
        console.log('The API returned an error: ' + err);
        reject("No files found")
      } 
    });
  });
};
module.exports = router;
