import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import authRoute from "./routers/auth.js";
import userProfileRoute from "./routers/user-profile.js";
import shopProfileRoute from "./routers/shop-profile.js";
import suggestionRoute from "./routers/suggestion.js";
import shopItemRoute from "./routers/shop-item.js";
import orderRoute from "./routers/order.js";
import chatRoute from "./routers/chat.js";

const env = require("dotenv");

env.config();

const port = 3000;
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", userProfileRoute);
app.use("/api/v1/shop", shopProfileRoute);
app.use("/api/v1/suggestion", suggestionRoute);
app.use("/api/v1/shop", shopItemRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/chat", chatRoute);

app.use((error, req, res, next) => {
  return res.json({
    status: 0,
    detail: error.message,
  });
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export default app;
