import ShopProfile from "../models/shop-profile.js";
import ShopCatalouge from '../models/shop-catalouge.js';
import User from "../models/user.js";
import { uploadImage, deleteImage } from "../aws/s3.js";

const shopProfileBucket = "kagyii-store-shop-profile";

export const create = async (req, res, next) => {

  const shopID = req.shop_id;

  if (shopID) {
    return next(new Error("shop already exist"));
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

    const s3CoverImg = await uploadImage(
      coverImg,
      shopProfileBucket,
      "cover-images/"
    );

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

    const newShopProfile = await shopProfile.save();
    await User.updateOne(
      { _id: userID },
      { shop_id: newShopProfile._id }
    ).exec();

    return res.json({
      status: 1,
      message: "success",
      data: newShopProfile,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};

export const getById = async (req, res, next) => {

  const shopID = req.params.shop_id;

  try {
    const shopProfileDoc = ShopProfile.findOne({ _id: shopID })
      .populate({ path: 'pre_defined_type', select: 'name' })
      .populate({ path: 'city', select: 'name' });

    const shopCatalougeDoc = ShopCatalouge.find({ shop_id: shopID });

    const [shopProfile, shopCatalouge] = await Promise.all([shopProfileDoc.exec(), shopCatalougeDoc.exec()]);

    if (shopProfile) {
      await shopProfile.updateOne({ $inc: { popularity: 1 } }).exec();
    }

    return res.json({
      status: 1,
      message: "Success",
      shop_profile: shopProfile,
      shop_catalouge: shopCatalouge
    });

  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};

export const edit = async (req, res, next) => {

  const shopID = req.params.shop_id;

  if (shopID != req.shop_id) {
    return next(new Error("permission error"));
  }

  const updateShopProfile = {};

  const name = req.body.name;
  const preDefinedType = req.body.pre_defined_type;
  const userDefinedType = req.body.user_defined_type;
  const about = req.body.about;
  const phone = req.body.phone;
  const address = req.body.address;
  const profileImg = req.body.profile_image;
  const coverImg = req.body.cover_image;

  if (name) {
    updateShopProfile.name = name;
  }

  if (preDefinedType) {
    updateShopProfile.pre_defined_type = preDefinedType;
  }

  if (userDefinedType) {
    updateShopProfile.user_defined_type = userDefinedType;
  }

  if (about) {
    updateShopProfile.about = about;
  }

  if (phone) {
    updateShopProfile.phone = phone;
  }

  if (address) {
    updateShopProfile.address = address;
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
      updateShopProfile.cover_img_key = s3CoverImg.key;
      updateShopProfile.cover_img_location = s3CoverImg.location;
    }

    if (profileImg) {
      s3ProfileImg = await uploadImage(
        profileImg,
        shopProfileBucket,
        "profile-images/"
      );
      updateShopProfile.profile_img_key = s3ProfileImg.key;
      updateShopProfile.profile_img_location = s3ProfileImg.location;
    }

    if (Object.keys(updateShopProfile).length != 0) {
      const oldShopProfile = await ShopProfile.findByIdAndUpdate(
        shopID,
        updateShopProfile
      ).exec();

      if (updateShopProfile.cover_img_key) {
        deleteImage(oldShopProfile.cover_img_key, shopProfileBucket);
      }

      if (updateShopProfile.profile_img_key) {
        deleteImage(oldShopProfile.profile_img_key, shopProfileBucket);
      }

      return res.json({
        status: 1,
        message: 'Success',
        data: updateShopProfile
      });
    } else {
      return next(new Error("need edit data"));
    }
  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};

export const get = async (req, res, next) => {

  const pageSize = 20;
  const filter = req.query.filter;
  const sort = req.query.sort;

  try {

    let query;

    if (filter.latest) {
      if (filter.type) {
        query = ShopProfile.find({ pre_defined_type: filter.type, createAt: { $lt: filter.latest } });
      } else if (filter.promo) {
        query = ShopProfile.find({ createAt: { $lt: filter.latest }, promo_expiry: { $gt: filter.promo } });
      } else if (filter.city) {
        query = ShopProfile.find({ city: filter.city, createAt: { $lt: filter.latest } });
      } else if (filter.favourite.length) {
        query = ShopProfile.find({
          pre_defined_type: { $in: filter.favourite },
          createAt: { $lt: filter.latest }
        });
      }

    } else {
      if (filter.type) {
        query = ShopProfile.find({ pre_defined_type: filter.type });
      } else if (filter.promo) {
        query = ShopProfile.find({ promo_expiry: { $gt: filter.promo } });
      } else if (filter.city) {
        query = ShopProfile.find({ city: filter.city });
      } else if (filter.favourite.length) {
        query = ShopProfile.find({ pre_defined_type: { $in: filter.favourite } });
      }
    }


    if (sort) {
      if (sort.popular) {
        query.sort({ popular: -1 });
      }
    }

    const shopProfiles = await query.limit(pageSize)
      .populate({ path: 'pre_defined_type', select: 'name' })
      .populate({ path: 'city', select: 'name' })
      .exec();

    return res.json({
      status: 1,
      message: "success",
      data: shopProfiles
    });

  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }

};


export const addCatalouge = async (req, res, next) => {

  const name = req.body.name;
  const shopID = req.params.shop_id;

  if (shopID != req.shop_id) {
    return next(new Error('permission error'));
  }

  const shopCatalouge = new ShopCatalouge({
    name: name,
    shop_id: shopID
  });

  try {
    await shopCatalouge.save();

    return res.json({
      status: 1,
      message: 'success'
    });

  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};

export const removeCatalouge = async (req, res, next) => {

  const catalougeId = req.params.catalouge_id;
  const shopID = req.params.shop_id;

  if (shopID != req.shop_id) {
    return next(new Error('permission error'));
  }

  try {
    await ShopCatalouge.deleteOne({ _id: catalougeId, shop_id: shopID }).exec();

    return res.json({
      status: 1,
      message: 'success'
    });

  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};


export const editCatalouge = async (req, res, next) => {
  const catalougeId = req.params.catalouge_id;
  const shopID = req.params.shop_id;
  const name = req.body.name;

  if (shopID != req.shop_id) {
    return next(new Error('permission error'));
  }

  try {
    await ShopCatalouge.updateOne({ _id: catalougeId, shop_id: shopID }, { name: name }).exec();

    return res.json({
      status: 1,
      message: 'success'
    });

  } catch (err) {
    console.log(err);
    return next(new Error("databse error"));
  }
};


