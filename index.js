const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()
// middlewares
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqva6ft.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const UserCollection = client.db('UsersDB').collection('Users')

        app.get('/', (req, res) => {
            res.send('Server is running')
        })
        app.get('/users', async (req, res) => {
            const cursor = UserCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await UserCollection.insertOne(user)
            res.send(result)
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result =await UserCollection.findOne(query)
            res.send(result)

        })
        app.delete('/users/:id',async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await UserCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/users/:id', async(req,res)=>{
            const id = req.params.id
            const user = req.body
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true}
            const updatedDoc = {

                $set:{
                    name:user.name,
                    email: user.email,
                    gender:user.gender,
                    status:user.status

                },
            };
            const result = await UserCollection.updateOne(filter,updatedDoc,options)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
})