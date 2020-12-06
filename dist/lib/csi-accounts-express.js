"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var constants_1 = require("./constants");
var verifyScopes = function (userScopes, permitted) {
    for (var _i = 0, permitted_1 = permitted; _i < permitted_1.length; _i++) {
        var scope = permitted_1[_i];
        if (userScopes.indexOf(scope) == -1) {
            return false;
        }
    }
    return true;
};
var verifyYear = function (regNo, permitted) {
    var userNum = regNo.slice(0, 2);
    for (var _i = 0, permitted_2 = permitted; _i < permitted_2.length; _i++) {
        var year = permitted_2[_i];
        if (userNum === year) {
            return true;
        }
    }
    return false;
};
var authorize = function (options) {
    return function (req, res, next) {
        var token = (req.headers['x-access-token'] || req.headers.authorization);
        if (options.token) {
            token = options.token(req, res, next);
        }
        if (!token || typeof token != 'string') {
            res.status(401).json({
                success: false,
                message: constants_1.default.invalidToken
            });
            return;
        }
        try {
            req.user = jsonwebtoken_1.default.verify(token, options.secret);
            if (options.scope !== undefined) {
                if (!verifyScopes(req.user.scope, options.scope)) {
                    return res.status(403).json({
                        success: false,
                        message: constants_1.default.insufficientPrivileges
                    });
                }
            }
            if (options.years !== undefined) {
                if (!verifyYear(req.user.regNo, options.years)) {
                    return res.status(403).json({
                        success: false,
                        message: constants_1.default.insufficientPrivileges
                    });
                }
            }
            next();
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: constants_1.default.invalidToken
            });
        }
    };
};
exports.default = authorize;
//# sourceMappingURL=csi-accounts-express.js.map