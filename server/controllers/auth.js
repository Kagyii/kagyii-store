import jwt from "jsonwebtoken";
import { JWT, JWKS, errors } from "jose";
import bcrypt from "bcryptjs";
import axios from "axios";
import dotenv from "dotenv";
import gAuth from "google-auth-library";

import User from "../models/user.js";

dotenv.config();

export const signUpWithEmail = async (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return next(new Error("email already exist"));
    } else {
      const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
      const auth = new User({
        email: email,
        password: hashPassword
      });
      const newUser = await auth.save();
      const authToken = jwt.sign({ userID: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
      await User.updateOne(
        { _id: newUser._id },
        { $push: { valid_token: authToken } }
      ).exec();
      return res.json({
        status: 1,
        message: "success",
        data: {
          auth_token: authToken,
          profile_setup: newUser.profile_setup,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return next(new Error('database error'));
  }
};

export const signInOrLoginWithProviders = async (req, res, next) => {

  const accessToken = req.body.access_token;
  const providerName = req.body.provider_name;

  try {
    let providerUserID;

    if (providerName == "apple") {
      const response = await axios({
        method: "get",
        url: "https://appleid.apple.com/auth/keys",
        timeout: 5000,
      });
      const key = JWKS.asKeyStore(response.data);
      const verifiedData = JWT.verify(accessToken, key);

      providerUserID = verifiedData.sub;
    } else if (providerName == "facebook") {
      const response = await axios({
        method: "get",
        url: "https://graph.facebook.com/debug_token",
        timeout: 5000,
        params: {
          input_token: accessToken,
          access_token: "323263692096120|HYh9St86gbznHMeCGXh-WCG4VEc",
        },
      });
      providerUserID = response.data.data.user_id;
    } else if (providerName == "google") {
      const CLIENT_ID = "421649987146-b6rfb6gargmskv4gp0in342ge0j98uit.apps.googleusercontent.com";
      const client = new gAuth.OAuth2Client(CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      providerUserID = payload.sub;
    }

    if (!providerUserID) {
      let error = new Error("token permission error");
      error.status = 0;
      return next(error);
    }

    const user = await User.findOne({
      provider_user_id: providerUserID,
    }).exec();

    if (user) {
      const authToken = jwt.sign(
        { userID: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      await User.updateOne(
        { _id: user._id },
        { $push: { valid_token: authToken } }
      ).exec();

      return res.json({
        status: 1,
        message: "success",
        data: {
          auth_token: authToken,
          profile_setup: user.profile_setup,
          profile_id: user.profile_id,
          shop_id: user.shop_id,
        },
      });
    } else {
      const auth = new User({
        provider_user_id: providerUserID,
        verified: true,
      });

      const newUser = await auth.save();
      const authToken = jwt.sign(
        { userID: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      await User.updateOne(
        { _id: newUser._id },
        { $push: { valid_token: authToken } }
      ).exec();

      return res.json({
        status: 1,
        message: "success",
        data: {
          auth_token: authToken,
          profile_setup: newUser.profile_setup,
        },
      });
    }
  } catch (err) {
    console.log(err);
    if (err instanceof errors.JOSEError && err.code === "ERR_JWS_VERIFICATION_FAILED") {
      return next(new Error("not a apple user"));
    } else {
      return next(new Error('database error'));
    }
  }
};

export const loginWithEmail = async (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      let correctPwd = await bcrypt.compare(password, user.password);
      if (correctPwd) {
        const authToken = jwt.sign(
          { userID: user._id },
          process.env.ACCESS_TOKEN_SECRET
        );
        await User.updateOne(
          { _id: user._id },
          { $push: { valid_token: authToken } }
        ).exec();

        return res.json({
          status: 1,
          message: "success",
          data: {
            auth_token: authToken,
            profile_setup: user.profile_setup,
            shop_id: user.shop_id,
            profile_id: user.profile_id
          },
        });
      } else {
        return next(new Error("password not match"));
      }
    } else {
      return next(new Error("user not exist"));
    }
  } catch (err) {
    console.log(err);
    return next(new Error("database error"));
  }
};


export const logout = async (req, res, next) => {

  const userID = req.decoded_token.userID;
  const type = req.body.type;
  const authToken = req.headers.auth_token;

  let query;

  if (type === 'one') {
    query = User.updateOne({ _id: userID }, { $pull: { valid_token: authToken } });
  } else if (type === 'all') {
    query = User.updateOne({ _id: userID }, { $set: { valid_token: [] } });
  }

  try {

    await query.exec();

    return res.json({
      status: 1,
      message: "success"
    });

  } catch (err) {
    console.log(err);
    return next(new Error("database error"));
  }
};
