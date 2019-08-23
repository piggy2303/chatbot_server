import express from "express";
import Joi from "joi";
import mongo from "mongodb";
import assert from "assert";
import { error, success } from "./defaultRespone";

import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_DATA_IMAGE,
  COLLECTION_QUESTION_DATA
} from "../constant/DATABASE";
import {
  findDocuments,
  updateDocument,
  updateManyDocument,
  findAllDocuments
} from "../database";

const app = express.Router();

app.get("/all", async (req, res) => {
  console.log("get all");

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_QUESTION_DATA);

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

app.post("/add", async (req, res) => {
  const schema = {
    text: Joi.string().required(),
    intent: Joi.string().required()
  };
  // validation
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return null;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_QUESTION_DATA);

      var new_data = {
        text: req.body.text,
        intent: req.body.intent
      };

      collection.insertOne(new_data, (err, result) => {
        assert.equal(err, null);
        console.log("add one document", new_data);
        res.send(success(new_data));
      });
    }
  );
});

app.get("/intent/:id", async (req, res) => {
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
      const db = database.db(DATABASE_NAME);

      findDocuments(db, COLLECTION_QUESTION_DATA, { intent: id }, result => {
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
