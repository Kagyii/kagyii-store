import validator from "express-validator";

import ShopProfile from "../models/shop-profile.js";
import { uploadImage, deleteImage } from "../aws/s3.js";
import User from "../models/user.js";

const shopProfileBucket = "kagyii-store-shop-profile";

export const create = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    console.log(err);
    return next(err);
  }

  const shopID = req.shop_id;

  if (shopID) {
    let error = new Error("shop already exist");
    error.status = 0;
    return next(error);
  }

  const userID = req.decoded_token.userID;
  const name = req.body.name;
  const preDefinedType = req.body.pre_defined_type;
  const userDefinedType = req.body.user_defined_type;
  const about = req.body.about;
  const phone = req.body.phone;
  const city = req.body.city;
  const address = req.body.address;
  const profileImg = req.body.profile_image;
  const coverImg = req.body.cover_image;

  try {
    let s3CoverImg = { key: null, location: null };

    if (coverImg) {
      s3CoverImg = await uploadImage(
        coverImg,
        shopProfileBucket,
        "cover-images/"
      );
    }
    const s3ProfileImg = await uploadImage(
      profileImg,
      shopProfileBucket,
      "profile-images/"
    );

    const shopProfile = new ShopProfile({
      name: name,
      pre_defined_type: preDefinedType,
      user_defined_type: userDefinedType,
      about: about,
      address: address,
      city: city,
      phone: phone,
      profile_img_key: s3ProfileImg.key,
      profile_img_location: s3ProfileImg.location,
      cover_img_key: s3CoverImg.key,
      cover_img_location: s3CoverImg.location,
    });

    const shopProfileDetails = await shopProfile.save();
    await User.updateOne(
      { _id: userID },
      { shop_id: shopProfileDetails._id }
    ).exec();

    return res.json({
      status: 1,
      message: "success",
      data: shopProfileDetails,
    });
  } catch (err) {
    console.log(err);
    let error = new Error("some error");
    error.status = 0;
    return next(error);
  }
};

export const getById = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }

  const shopID = req.params.shop_id;

  try {

    const shopProfile = await ShopProfile.findOne({ _id: shopID })
      .populate({ path: 'pre_defined_type', select: 'name' })
      .populate({ path: 'city', select: 'name' })
      .exec();

    if (shopProfile) {
      return res.json({
        status: 1,
        message: "Success",
        data: shopProfile
      });
    } else {
      let error = new Error("shop not exist");
      error.status = 0;
      return next(error);
    }
  } catch (err) {
    console.log(err);
    let error = new Error("some errors");
    error.status = 0;
    return next(error);
  }
};

export const edit = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }

  const shopID = req.params.shop_id;

  if (req.params.shop_id != req.shop_id) {
    let error = new Error("permission error");
    error.status = 0;
    return next(error);
  }

  const shopProfileUpdate = {};

  const name = req.body.name;
  const preDefinedType = req.body.pre_defined_type;
  const userDefinedType = req.body.user_defined_type;
  const about = req.body.about;
  const phone = req.body.phone;
  const address = req.body.address;
  const profileImg = req.body.profile_image;
  const coverImg = req.body.cover_image;

  if (name) {
    shopProfileUpdate.name = name;
  }

  if (preDefinedType) {
    shopProfileUpdate.pre_defined_type = preDefinedType;
  }

  if (userDefinedType) {
    shopProfileUpdate.user_defined_type = userDefinedType;
  }

  if (about) {
    shopProfileUpdate.about = about;
  }

  if (phone) {
    shopProfileUpdate.phone = phone;
  }

  if (address) {
    shopProfileUpdate.address = address;
  }

  try {
    let s3CoverImg = {};
    let s3ProfileImg = {};

    if (coverImg) {
      s3CoverImg = await uploadImage(
        coverImg,
        shopProfileBucket,
        "cover-images/"
      );
      shopProfileUpdate.cover_img_key = s3CoverImg.key;
      shopProfileUpdate.cover_img_location = s3CoverImg.location;
    }

    if (profileImg) {
      s3ProfileImg = await uploadImage(
        profileImg,
        shopProfileBucket,
        "profile-images/"
      );
      shopProfileUpdate.profile_img_key = s3ProfileImg.key;
      shopProfileUpdate.profile_img_location = s3ProfileImg.location;
    }

    if (Object.keys(shopProfileUpdate).length != 0) {
      const shopProfile = await ShopProfile.findByIdAndUpdate(
        shopID,
        shopProfileUpdate
      ).exec();

      if (shopProfileUpdate.cover_img_key) {
        deleteImage(shopProfile.cover_img_key, shopProfileBucket);
      }

      if (shopProfileUpdate.profile_img_key) {
        deleteImage(shopProfile.profile_img_key, shopProfileBucket);
      }

      return res.json({
        status: 1,
        message: "Success",
      });
    } else {
      let error = new Error("no edit data");
      error.status = 0;
      return next(error);
    }
  } catch (err) {
    console.log(err);
    let error = new Error("some errors");
    error.status = 0;
    return next(error);
  }
};

export const createCatalouge = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }

  const shopID = req.params.shop_id;
  const name = req.body.name;

  if (req.params.shop_id != req.shop_id) {
    let error = new Error("permission error");
    error.status = 0;
    return next(error);
  }

  try {
    await ShopProfile.updateOne(
      { _id: shopID },
      { $push: { catalouge: { name: name } } }
    ).exec();

    return res.json({
      status: 1,
      message: "success",
    });
  } catch (err) {
    console.log(err);
    let error = new Error("some errors");
    error.status = 0;
    return next(error);
  }
};

export const get = async (req, res, next) => {
  const validationErr = validator.validationResult(req);

  if (!validationErr.isEmpty()) {
    let err = new Error(validationErr.errors[0].msg);
    err.status = 0;
    return next(err);
  }

  const lastShopID = req.query.last_shop;
  const type = req.query.type;
  const pageSize = 20;

  try {

    let query;

    if (type) {
      if (lastShopID) {
        query = ShopProfile.find({ pre_defined_type: type, _id: { $gt: lastShopID } });
      } else {
        query = ShopProfile.find({ pre_defined_type: type });
      }
    } else {
      if (lastShopID) {
        query = ShopProfile.find({ _id: { $gt: lastShopID } });
      } else {
        query = ShopProfile.find({});
      }
    }

    const shopProfiles = await query.sort({ name: -1 }).limit(pageSize).exec();

    return res.json({
      status: 1,
      message: "success",
      data: shopProfiles
    });

  } catch (err) {
    console.log(err);
    let error = new Error("some errors");
    error.status = 0;
    return next(error);
  }

};
