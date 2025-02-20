const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use (cors({origin:["http://localhost:5173","https://art-and-craft-store-c82cd.web.app"]})) 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vksh2ow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const artCollection = client.db('artAndCraftDB').collection('paintingAndDrawing');
    const allArtCollection = client.db('allArtDB').collection('allArt');

    app.get('/artAndCraft',async (req, res)=>{
        const cursor = artCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/artAndCraft/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await artCollection.findOne(query);
        res.send(result);
    })

    app.post('/myArt', async (req, res) => {
      const addedArt = req.body;
      console.log(addedArt);
      const result = await allArtCollection.insertOne(addedArt);
      res.send(result);
  })

  app.get('/allArt', async (req, res) => {
    const cursor = allArtCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})
app.put('/allArt/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updatedArt = req.body;

  const art = {
      $set: {
           item_name: updatedArt. item_name, 
          subcategory_Name: updatedArt.subcategory_Name, 
          shortDescription: updatedArt.shortDescription, 
          price: updatedArt.price, 
          rating: updatedArt.rating, 
          customization: updatedArt.customization, 
          processing_time: updatedArt.processing_time,
          stockStatus: updatedArt.stockStatus,
          name: updatedArt.name,
          email: updatedArt.email,
          photo: updatedArt.photo
      }
  }

  const result = await allArtCollection.updateOne(filter, art, options);
  res.send(result);
})

 app.delete('/allArt/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await allArtCollection.deleteOne(query);
    res.send(result);
})

 app.get('/allArt/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await allArtCollection.findOne(query);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Art and Craft store server is running');
} )

app.listen(port, ()=>{
    console.log(`Art and Craft store Server is running on port: ${port}`)
})

