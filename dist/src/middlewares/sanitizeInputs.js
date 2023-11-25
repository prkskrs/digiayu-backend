"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const recursive_sanitize_obj = (obj) => {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (typeof obj[i] === 'object') {
                recursive_sanitize_obj(obj[i]);
            }
            else if (typeof obj[i] === 'string') {
                obj[i] = validator_1.default.escape(obj[i]);
            }
        }
    }
    else {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                recursive_sanitize_obj(obj[key]);
            }
            else if (typeof obj[key] === 'string') {
                obj[key] = validator_1.default.escape(obj[key]);
            }
        }
    }
    return obj;
};
const sanitize_inputs = (keys) => (req, res, next) => {
    // Whitelist characters regex
    // const regex = /[^a-zA-Z0-9äöüÄÖÜ]*/gm;
    for (const key of keys) {
        if (typeof req.body[key] === 'boolean') {
            continue;
        }
        else if (typeof req.body[key] === 'object') {
            req.body[key] = recursive_sanitize_obj(req.body[key]);
        }
        else if (typeof req.body[key] === 'string') {
            req.body[key] = validator_1.default.escape(req.body[key]);
        }
    }
    for (const key in req.params) {
        req.params[key] = validator_1.default.escape(req.params[key]);
        // req.params[key] = req.params[key].replace(regex, '');
    }
    for (const key in req.query) {
        req.query[key] = validator_1.default.escape(req.query[key]);
    }
    next();
};
exports.default = sanitize_inputs;
// module.exports =  sanitize_inputs ;
//# sourceMappingURL=sanitizeInputs.js.map