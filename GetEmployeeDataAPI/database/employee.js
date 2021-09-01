const {getDatabase} = require('./mongo');

const collectionName = 'emp';

async function getEE() {
    const database = await getDatabase();
    let details = await database.collection(collectionName).find({}).toArray();
    return details;
    
}

async function getEmpFromLastName(lname) {
    const database = await getDatabase();
    let details = await database.collection(collectionName).find({lastName: lname}).toArray();
    return details;
}

async function getEmpFromEdu(edu) {
    const database = await getDatabase();
    let details = await database.collection(collectionName).find({educationLevel: edu}).toArray();
    return details;
 }

async function getEmpFromCompany(company) {
    const database = await getDatabase();
    let details = await database.collection(collectionName).find({company: company}).toArray();
    return details;
}

module.exports = {
    getEE,
    getEmpFromLastName,
    getEmpFromEdu,
    getEmpFromCompany,
};