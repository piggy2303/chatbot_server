import express from "express";
import Joi from "joi";
import mongo from "mongodb";
import assert from "assert";
import { error, success } from "./defaultRespone";

import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_DATA_IMAGE
} from "../constant/DATABASE";
import {
  findDocuments,
  updateDocument,
  updateManyDocument,
  findAllDocuments
} from "../database";

const app = express.Router();

app.get("/all", async (req, res) => {
  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_DATA_IMAGE);

      collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        if (docs.toString() == "") {
          res.send(success(docs));
        } else {
          res.send(success(docs));
        }
      });
    }
  );
});

app.get("/:id", async (req, res) => {
  console.log("/:id");

  const schema = {
    id: Joi.string()
      .min(0)
      .required()
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const id = req.params.id;

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = database.db(DATABASE_NAME);

      findDocuments(db, COLLECTION_DATA_IMAGE, { image_id: id }, result => {
        if (result.toString() == "") {
          res.send(error(err));
        } else {
          res.send(success(result));
        }
      });
    }
  );
});

module.exports = app;
