// 'express' allows the app to be created (all pfevious steps must be followed)
const express = require('express');
const bodyparser = require('body-parser'); // allows json files to be parsed in
const path = require('path'); // contects the app to the path specifies
const ejs = require('ejs'); // sets the view templates
const opn = require('opn'); // allows opening of browser
const fs = require('fs');
const jsonParseMulti = require('json-multi-parse'); // deals with the json objects being in the same file

// these give information on where the database will be stored and its admin
var user = 'andrew';
var password = 'andrew';
var host = '127.0.0.1';
var port = 5984;

const app = express(); // defines the webpage

const json_obj = 'C:/Users/ADMIN/Downloads/CCP-Data_Samples.json'; // the address the data is stored at

const json_content = fs.readFileSync(json_obj, 'utf8'); // read dta into a variable

var json_array = jsonParseMulti(json_content); // parses the two json objects into an array

// iterates through an array of unknown length
json_array.forEach(function (obj) {
    // console.log(obj);

    // use nano for actions on this server
    const nano = require('nano')('http://' + user + ':' + password + '@' + host + ':' + port);

    // nano.db.create('wonderland');

    // specify the database we are going to use and make it a variable
    const alice = nano.use('alice');
    // and insert a document in it, whats going wrong is that there is a step inbetween create and insert
    alice.insert({
        Temperature: obj.TagTemperature,
        Sample_time: obj.TemperatureSampleTime // information in the document
    }, obj.TagSerialNumber, function (err, body) {
        if (err) {
            console.log('document error', err.message); // message that there was a screw up
            return;
        }
        console.log('document saved'); // message that all went well
        console.log(body); // prints the id of the document sent to couchdb
    });

    const wonderland = nano.use('wonderland');

    wonderland.insert({
        Latitude: obj.lat,
        Longitude: obj.lng // information in the document
    }, obj.TagSerialNumber, function (err, body) {
        if (err) {
            console.log('document error', err.message); // message that there was a screw up
            return;
        }
        console.log('document saved'); // message that all went well
        console.log(body); // prints the id of the document sent to couchdb
    });
});
app.get('/homepage', function (request, response) { // the place for the text

    response.send('home page'); // sends some text to a page seperated from the port number by a dash
});
// starts the server on port 3000 of the local host
app.listen(3000, function () {

    console.log('Server started on port 3000'); // message to the console
    opn('http://127.0.0.1:3000/homepage'); // opens the page in the browser

});