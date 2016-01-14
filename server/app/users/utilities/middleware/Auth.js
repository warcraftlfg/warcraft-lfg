/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAuthenticated = function (req, res, next){
    if (req.user)
        return next();
    res.status(403).send("ACCESS_DENIED");
};