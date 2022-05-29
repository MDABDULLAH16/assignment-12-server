const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//use midlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lrdgq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('assignment-12').collection('users');
        const partCollection = client.db('assignment-12').collection('parts');
        const reviewsCollection = client.db('assignment-12').collection('reviwes');
        const ordersCollection = client.db('assignment-12').collection('orders');

        // parts add db
        app.get('/part', async (req, res) => {
            const query = {};
            const cursor = partCollection.find(query);
            const reviwes = await cursor.toArray()
            res.send(reviwes);
        })
        //parts show ui
        app.post('/part', async (req, res) => {
            const newPart = req.body;
            console.log('adding new parts')
            const result = await partCollection.insertOne(newPart);
            res.send(result)
        })


        //parts add db by form
        app.get('/part', async (req, res) => {
            const query = {};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        })
        //single id
        app.get('/part/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tool = await partCollection.findOne(query);
            res.send(tool);
        });
        app.post('/part/:id', async (req, res) => {
            const newService = req.body;
            const result = await partCollection.insertOne(newService);
            res.send(result);
        });

        // user email 
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        })

        app.get('/user', async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        })
        //update
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const object = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    availableQuantity: object.updatedQuantity,
                },
            };
            const result = await partCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // dashboard review data 
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        // / post / add review
        app.post('/review', async (req, res) => {
            const newService = req.body;
            const result = await reviewsCollection.insertOne(newService);
            res.send(result);
        });
        //order
        app.get('/order', async (req, res) => {
            const users = await ordersCollection.find().toArray();
            res.send(users);
        })
        // // post add items
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });


    }
    finally {

    }

}
run().catch(console.dir);
//root

app.get('/', (req, res) => {
    res.send('Assignmnet-12 is Running');
})
app.listen(port, () => {
    console.log('server site is running', port);
})