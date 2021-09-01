const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const app = module.exports = express();
const {getEE, getEmpFromLastName, getEmpFromEdu, getEmpFromCompany} = require('./database/employee');

app.use(helmet());
app.use(cors());

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', 
    path: path.join(__dirname, 'log')});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(express.static('public'));
app.get('/', express.static(path.join(__dirname, 'public')));

app.get('/api/employees', async (req, res, next) => {
    try {
        const {headers, method, url} = req;
        res.setHeader('Content-Type', 'application/json')
        let body = [];
        body = await getEE(); 
        const responseBody = {headers, method, url, body};
        res.send(JSON.stringify(responseBody));
    } catch (err) {
        next(err);
    }
});

app.get('/api/employees/lastName/:lastName([A-Za-z _,\-.]{3,30})', async (req, res, next) => {
    try {
        const {headers, method, url} = req;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        let body = [];
        body = await getEmpFromLastName(req.params.lastName);
        const responseBody = {headers, method, url, body};
        res.send(JSON.stringify(responseBody));
    } catch (err) {
        next(err);
    }
});

app.get('/api/employees/edu/:edu([A-Za-z_\-]{5,22})', async (req, res, next) => {
    try {
        const rawEduInput = req.params.edu;
        let eduInput = [];
        const eduInputCheck = rawEduInput.toLowerCase();
        switch (eduInputCheck) {
            case 'bachelor':
                eduInput = 'Bachelor';
                break;
            case 'master':
                eduInput = 'Master';
                break;
            case 'associate':
                eduInput = 'Associate';
                break;
            case 'vocational':
                eduInput = 'Vocational';
                break;
            case 'high_school':
                eduInput = 'High School';
                break;
            case 'doctorate':
                eduInput = 'Doctorate';
                break;
            case 'less_than_high_school':
                eduInput = 'Less Than High School';
                break;
            default:
                    //404 errors
                    res.status(404).send("Unfortunately, something in the input is incorrect. \
                    Please make sure that the URL path is correct and try again.");       
        }
        const {headers, method, url} = req;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        let body = [];
        body = await getEmpFromEdu(eduInput);
        const responseBody = {headers, method, url, body};
        res.send(JSON.stringify(responseBody));
    } catch (err) {
        next(err);
    }
});

app.get('/api/employees/co/:company([A-Za-z_,\-.]{3,30})', async (req, res, next) => {
    try {
        var rawCompInput = req.params.company;
        var compInput = rawCompInput.replace('_', " ");
        const {headers, method, url} = req;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        let body = [];
        body = await getEmpFromCompany(compInput);
        const responseBody = {headers, method, url, body};
        res.send(JSON.stringify(responseBody));
    } catch (err) {
        next(err);
    }  
});

app.get('*', async (req, res) => {
    //404 errors
    res.status(404).send("Unfortunately, something in the input is incorrect. \
    Please make sure that the URL path is correct and try again.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));