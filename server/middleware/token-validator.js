//npm packages
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = async (req, res, next) => {

//     let authToken = req.headers.auth_token;

//     try {

//         let decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

//         let result = await validToken.check(decodedToken.userID, authToken)

//         if (result) {
//             req.decodedToken = decodedToken
//             return next()
//         } else {
//             let err = new Error('Invalid Auth Token')
//             err.status = 0
//             return next(err)
//         }
//     } catch (err) {
//         err.status = 0
//         return next(err)
//     }
// }