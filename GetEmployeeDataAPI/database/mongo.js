const {MongoClient} = require('mongodb');

let database = null;

async function startDatabase() {
    const connection = await MongoClient.connect('mongodb://localhost:27017/employees', {useNewUrlParser: true});
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

module.exports = {
    getDatabase,
    startDatabase,
};
