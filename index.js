const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dygkbp4.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client
      .db("coffeeDB")
      .collection("coffeeCollection");

    app.get("/coffees", async (req, res) => {
      const courser = coffeeCollection.find();
      const result = await courser.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result)
    });

    app.post("/coffees", async (req, res) => {
      const newCoffees = req.body;
      console.log("new coffees :", newCoffees);
      const result = await coffeeCollection.insertOne(newCoffees);
      res.send(result);
    });

    app.put('/coffees/:id',async (req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffees =req.body;
      const Coffees = {
        $set: {
          coffee: updateCoffees.coffee,
           chef: updateCoffees.chef,
           supplier: updateCoffees. supplier,
           taste: updateCoffees.taste,
           category: updateCoffees. category,
           details: updateCoffees. details,
           photo: updateCoffees. photo

        },
      };
      const result = await  coffeeCollection.updateOne(filter, Coffees, options);
      res.send(result)
    })

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee-store-server is running with mongodb");
});

app.listen(port, () => {
  console.log(`coffee-store-server running with mongodb on port:${port}`);
});
