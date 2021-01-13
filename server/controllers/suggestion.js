import Suggestion from "../models/suggestion.js";

export const get = async (req, res, next) => {
  const type = req.query.type;

  try {
    const suggestion = await Suggestion.find({ type: type }).exec();

    return res.json({
      status: 1,
      message: "success",
      data: suggestion,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("database error"));
  }
};

export const add = async (req, res, next) => {
  const name = req.body.name;
  const type = req.body.type;

  const suggestion = new Suggestion({
    name: name,
    type: type,
  });

  try {
    await suggestion.save();
    return res.json({
      status: 1,
      message: "success",
    });
  } catch (err) {
    return next(new Error("database error"));
  }
};
