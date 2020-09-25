import validator from 'express-validator';

import Suggestion from '../models/suggestion.js';

export const get = async (req, res, next) => {

    const type = req.query.type;

    try {
        const suggestion = await Suggestion.find({ type: type });

        return res.json({
            status: 1,
            message: 'success',
            data: suggestion
        })
    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }
}

export const add = async (req, res, next) => {

    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const name = req.body.name;
    const type = req.body.type;

    const suggestion = new Suggestion({
        name: name,
        type: type
    });

    try {
        await suggestion.save();

        return res.json({
            status: 1,
            message: 'success'
        })
    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }
}
