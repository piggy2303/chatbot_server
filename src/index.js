import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// router
import user from "./route/user";
import image from "./route/image";
import phongtruyenthong from "./route/phongtruyenthong";
import questiondata from "./route/questiondata";

const app = express();
const port = process.env.PORT;
app.set("port", port || 5001);

app.use(bodyParser.json({ limit: "200mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/chatbot/image", image);
app.use("/chatbot/user", user);
app.use("/chatbot/phongtruyenthong", phongtruyenthong);
app.use("/chatbot/questiondata", questiondata);

app.listen(app.get("port"), () => {
  console.log("Node server is running on port " + app.get("port"));
});
