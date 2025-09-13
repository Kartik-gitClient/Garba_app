import fs from "fs";
import csv from "csv-parser";
import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017"; // local MongoDB URI
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("garba_event");
    const collection = db.collection("serials");

    // Empty the collection before inserting new data
    await collection.deleteMany({});

    const results = [];
    fs.createReadStream("serials.csv")
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          SNo: Number(row.SNo),
          SerialNumber: row.SerialNumber,
          IsAssigned: row.IsAssigned.toLowerCase() === "true",
          assignedTo: null, // new field
        });
      })
      .on("end", async () => {
        console.log("CSV parsed. Inserting into MongoDB...");
        await collection.insertMany(results);
        console.log("✅ Data inserted successfully!");
        await client.close();
      });
  } catch (err) {
    console.error(err);
  }
}

run();
