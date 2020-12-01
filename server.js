//MongoDB stuff
const MongoClient = require('mongodb').MongoClient
const dbName = "indeed"
const url = "mongodb://localhost:27017/" + dbName
const collection = "metering"

//Stuff for the Rest-API
const express = require('express'),
    bodyParser = require('body-parser');
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*")
    next();
})
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}))
app.use(bodyParser.json({ limit: '50mb' }));
app.listen(8543);

/**
 * Creation of DB and one collection. Only call it once for a new mongo instance!
 */
const creation = async () => {
    return new Promise((reject, result) => {
        MongoClient.connect(url, (err, db) => {
            try {
                if (err) throw err;
                console.log("To database", dbName, "connected...")
                let dbo = db.db(dbName)
                dbo.createCollection(collection, (err, res) => {
                    if (err) {
                        if (err.codeName === 'NamespaceExists') {
                            console.log("Collection already exists")
                        }
                        else throw err
                    } else {
                        console.log("Collection", collection, "created!")
                    }
                    db.close()
                    result(true)
                })
            } catch (err) {
                db.close()
                reject(err)
            }
        })
    })

}

/**
 * Get all entries by http get
 */
app.get('/getAllEntries', async (req, res) => {
    let json = {
        message: {},
        code: 200
    }
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db(dbName);
        dbo.collection(collection).find({}).toArray(function (error, result) {
            if (err) json = { message: error, code: 400 }
            console.log(result)
            json.message = result
            db.close()
            res.status(200);
            res.send(json);
        });
    });
});

/**
 * Adds new entry to database by http post. Format: 
 * { 
 *  "counter": number,
 *  "date": number 
 * }
 */
app.post('/newEntry', async (req, res) => {
    let result = req.body
    console.log(result)
    let myobj = { counter: req.body.counter, date: req.body.date };
    let json = {
        message: myobj,
        code: 200
    }
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db(dbName);
        dbo.collection(collection).insertOne(myobj, function (error, result) {
            if (error) json = { message: err, code: 400 }
            console.log("new entry")
            db.close()
            res.status(200);
            res.send(json);
        });
    });
});

const main = async () => {
    let test = await creation().catch(err => console.log(JSON.stringify(err)))
    console.log("test", test)
}
main()
