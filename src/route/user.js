import express from 'express';
import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import mongo from 'mongodb';
import assert from 'assert';
import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE,
  COLLECTION_USER,
  COLLECTION_UPLOAD_IMAGE,
} from '../constant/DATABASE';
import { findDocuments, insertOneDocument } from '../database';
import { JWT_KEY } from '../constant/JWT_KEY';
import { decode } from 'punycode';
import { error, success } from './defaultRespone';
import { USER_NAME_RANDOM } from '../constant/userNameRandomData';
import moment from 'moment';

const app = express.Router();

// CRUD

const createUser = device_id => {
  const random = Math.floor(Math.random() * 50 + 1);
  const radomName = USER_NAME_RANDOM.find(x => x.index == random);
  const data = {
    device_id,
    user_name: radomName.name,
    user_logo: radomName.image,
    user_role: 100,
    day_update: moment().toISOString(),
  };
  return data;
};

app.get('/:device_id', async (req, res) => {
  const schema = {
    device_id: Joi.string().required(),
  };

  // validate key word truyen vao
  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_USER);

      collection
        .find({ device_id: req.params.device_id })
        .toArray((err, docs) => {
          assert.equal(err, null);
          if (docs.toString() == '') {
            res.send(success(null));
          } else {
            res.send(success(docs));
          }
        });
    },
  );
});

app.post('/auth', async (req, res) => {
  const schema = {
    device_id: Joi.string()
      .min(2)
      .required(),
  };

  // validate key word truyen vao
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  // res.send(createUser('ha'));

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);

      // tim kiem device_id trong db
      findDocuments(
        db,
        COLLECTION_USER,
        { device_id: req.body.device_id },
        result => {
          if (result.toString() == '') {
            // neu khong co thi them user
            // tra ve token
            const radomNewUser = createUser(req.body.device_id);

            insertOneDocument(db, COLLECTION_USER, radomNewUser, result => {
              if (result.result.n == 1) {
                res.send(success(radomNewUser));
              }
            });
          } else {
            // neu co thi tra ve token
            const data = result[0];
            console.log(data);

            res.send(success(data));
          }
        },
      );
    },
  );
});

// only update user name
app.post('/update', async (req, res) => {
  const schema = {
    device_id: Joi.string()
      .min(2)
      .required(),
    user_name: Joi.string()
      .min(2)
      .required(),
  };

  // validate token truyen vao
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);
      const collection = db.collection(COLLECTION_USER);

      collection.updateOne(
        { device_id: req.body.device_id },
        { $set: { user_name: req.body.user_name } },
        (err, result) => {
          assert.equal(err, null);
          console.log('update one document');
          res.send(success('update one document'));
        },
      );
    },
  );
});

// app.get('/upload', async (req, res) => {
//   console.log('upload all');

//   await mongo.connect(
//     MONGODB_URL,
//     { useNewUrlParser: true },
//     (err, database) => {
//       assert.equal(null, err);
//       const db = database.db(DATABASE_NAME);
//       const collection = db.collection(COLLECTION_UPLOAD_IMAGE);

//       collection.find({}).toArray((err, docs) => {
//         assert.equal(err, null);
//         if (docs.toString() == '') {
//           res.send(success(docs));
//         } else {
//           res.send(success(docs));
//         }
//       });
//     },
//   );
// });

app.get('/upload/:device_id', async (req, res) => {
  console.log('upload id');

  const schema = {
    device_id: Joi.string()
      .min(2)
      .required(),
  };

  // validation device_id
  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  await mongo.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    (err, database) => {
      assert.equal(null, err);
      const db = database.db(DATABASE_NAME);

      // tim kiem device_id trong db
      findDocuments(
        db,
        COLLECTION_UPLOAD_IMAGE,
        { device_id: req.params.device_id },
        result => {
          if (result.toString() == '') {
            res.send(success(null));
          } else {
            res.send(success(result));
          }
        },
      );
    },
  );
});

module.exports = app;
