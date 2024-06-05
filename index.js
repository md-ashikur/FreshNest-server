const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://ashik76690:Yym6xcFm2XtLrQe2@cluster0.gha5iai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("food");
    const foodCollection = database.collection("foodCollection");


    // post product----------
    app.post("/foods", async (req, res) => {
      const foodData = req.body;

      const result = await foodCollection.insertOne(foodData);
      res.send(result);
    });

    // get product----------
    app.get("/foods", async (req, res) => {
        const foodsData = foodCollection.find();
        const result = await foodsData.toArray();
        res.send(result);
      });


      app.delete("/foods/:id", async (req, res) => {
        const id = req.params.id;
        const result = await foodCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      });



    await client.db("admin").command({ ping: 1 });
    console.log("connect");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("workings");
});

app.listen(port, (req, res) => {
  console.log("listening on port :", port);
});

// ashik76690
// Yym6xcFm2XtLrQe2
