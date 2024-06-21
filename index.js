const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URL;

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

    const database = client.db("product");
    const productCollection = database.collection("productCollection");

    // post product----------
    app.post("/product", async (req, res) => {
      const productData = req.body;
      const result = await productCollection.insertOne(productData);
      res.send(result);
    });

    // get product----------
    app.get("/products", async (req, res) => {
      const productData = productCollection.find();
      const result = await productData.toArray();
      res.send(result);
    });

    // single product details----------
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const productData = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(productData);

    });
    // edit product-------
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await productCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    // delete product----------
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: new ObjectId(id) });
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
