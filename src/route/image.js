import express from "express";
import fs from "fs";
// import Axios from 'axios';
import path from "path";
import Joi from "joi";
import mongo from "mongodb";
import assert from "assert";
// import moduleName from '../../src/python/upload';

import {
  MONGODB_URL,
  DATABASE_NAME,
  COLLECTION_LIST_ALL_IMAGE
} from "../constant/DATABASE";
import { error } from "./defaultRespone";
import { findDocuments } from "../database";

const app = express.Router();

app.get("/:path", (req, res) => {
  const schema = {
    path: Joi.string().required()
  };

  const validation = Joi.validate(req.params, schema);
  if (validation.error) {
    res.send(error(validation));
    return;
  }

  const pathImage = "./assets/image/" + req.params.path;
  fs.readFile(pathImage, (err, data) => {
    if (err) {
      // catch error
      res.send(error(err));
    } else {
      // success
      res.sendFile(path.resolve(pathImage));
    }
  });
});

module.exports = app;
