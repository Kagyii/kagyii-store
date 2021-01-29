import { Chat, ChatSession } from "../models/chat.js";
import ShopProfile from "../models/shop-profile.js";
import { uploadImage } from "../aws/s3.js";

const chatBucket = "kagyii-store-chat";

export const createSession = async (req, res, next) => {
  const profileId = req.body.profile_id;
  const shopId = req.body.shop_id;

  try {
    const chatSession = await new ChatSession({
      profile_id: profileId,
      shop_id: shopId,
    }).save();

    return res.json({
      status: 1,
      message: "success",
      data: chatSession,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};

export const getSession = async (req, res, next) => {
  const shopId = req.query.shop_id;
  const profileId = req.query.profile_id;

  try {
    const chatSession = await ChatSession.findOne({
      shop_id: shopId,
      profile_id: profileId,
    }).exec();
    return res.json({
      status: 1,
      message: "success",
      data: chatSession,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};

export const getSessions = async (req, res, next) => {
  const id = req.query.id;
  const type = req.query.type;
  const filter = req.query.filter;
  const findWith = {};
  const pageSize = 3;
  const populateProfile = {};

  if (type === "user") {
    if (id == req.user_info.profile_id) {
      findWith.profile_id = id;
      populateProfile.path = "user_profile";
    } else {
      return next(new Error("authorization error"));
    }
  } else if (type === "shop") {
    if (id == req.user_info.shop_id) {
      findWith.shop_id = id;
      populateProfile.path = "shop_profile";
    } else {
      return next(new Error("authorization error"));
    }
  }

  if (filter.latest) {
    findWith.createdAt = { $lt: filter.latest };
  }

  try {
    const chatSessions = await ChatSession.find(findWith)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .populate(populateProfile)
      .populate({ path: "chat", select: "message" })
      .exec();

    return res.json({
      status: 1,
      message: "success",
      data: chatSessions,
    });
  } catch (err) {
    return next(new Error("internal error"));
  }
};

export const deleteSession = async (req, res, next) => {};

export const sendMessage = async (req, res, next) => {
  const sessionId = req.params.session_id;
  const from = req.body.from;
  const to = req.body.to;
  const profileId = req.body.profile_id;
  const shopId = req.body.shop_id;
  const text = req.body.text;
  const image = req.body.image;

  if (!text && !!image) {
    return next(new Error("need message"));
  }

  try {
    const chatData = { session_id: sessionId, from: from, to: to };
    const message = { text: text };
    if (image) {
      const s3Image = await uploadImage(
        image,
        chatBucket,
        `${shopId}${profileId}/`
      );
      message.img_key = s3Image.key;
      message.img_location = s3Image.location;
    }

    chatData.message = message;

    const chat = await new Chat(chatData).save();

    await ChatSession.updateOne(
      { _id: sessionId, profile_id: profileId, shop_id: shopId },
      { chat_id: chat._id }
    ).exec();

    return res.json({
      status: 1,
      message: "success",
    });
  } catch (err) {
    return next(new Error("internal error"));
  }
};

export const getMessage = async (req, res, next) => {
  const sessionId = req.params.session_id;
  const id = req.query.id;
  const type = req.query.type;
  const filter = req.query.filter;

  if (type === "user") {
    if (id !== req.user_info.profile_id) {
      return next(new Error("authorization error"));
    }
  } else if (type === "shop") {
    if (id !== req.user_info.shop_id) {
      return next(new Error("authorization error"));
    }
  }

  const findWith = { session_id: sessionId };
  if (filter.latest) {
    findWith.createdAt = filter.latest;
  }

  try {
    const chatDocs = await Chat.find(findWith).sort({ createdAt: -1 }).exec();

    return res.json({
      status: 1,
      message: "success",
      data: chatDocs,
    });
  } catch (error) {
    return next(new Error("internal error"));
  }
};
