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

app.post("/update", async (req, res) => {
  const schema = {
    image_id: Joi.string().required(),
    text_en: Joi.string(),
    text_vn: Joi.string()
  };

  // validation image_id
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
      const collection = db.collection(COLLECTION_DATA_IMAGE);

      collection.updateOne(
        { image_id: req.body.image_id },
        {
          $set: {
            text_en: req.body.text_en,
            text_vn: req.body.text_vn
          }
        },
        (err, result) => {
          assert.equal(err, null);
          console.log("update one document");
          res.send(success("update one document"));
        }
      );
    }
  );
});

app.get("/:id", async (req, res) => {
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
