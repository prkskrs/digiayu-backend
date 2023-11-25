"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestValidator = (schema, path = 'body') => {
    return (req, res, next) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const { error } = schema
            .preferences({ convert: false, stripUnknown: true })
            .validate(req[path]);
        if (error === undefined) {
            next();
        }
        else {
            const { details } = error;
            console.log(details);
            let message = '';
            const [dataType, errorType] = (_b = (_a = details[0]) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.split('.');
            const limit = (_d = (_c = details[0]) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.limit;
            const fieldName = ((_e = details[0]) === null || _e === void 0 ? void 0 : _e.context.label.split('_').length) === 1
                ? (_f = details[0]) === null || _f === void 0 ? void 0 : _f.context.label
                : (_g = details[0]) === null || _g === void 0 ? void 0 : _g.context.label.split('_').join(' ');
            switch (errorType) {
                case 'required':
                    message = `${fieldName} is required`;
                    break;
                case 'empty':
                    message = `${fieldName} is not allowed to be empty`;
                    break;
                case 'base':
                    message = `${fieldName} must be a ${dataType}`;
                    break;
                case 'min':
                    message = `${fieldName} must be greater than or equal to ${limit}`;
                    break;
                case 'max':
                    message = `${fieldName} must be lesser than or equal to ${limit}`;
                    break;
                case 'pattern':
                    message = `${fieldName} does not match the required pattern`;
                    break;
                default:
                    message = details.map((i) => i.message).join(',');
            }
            res.status(400).json({ success: false, error: message });
        }
    };
};
exports.default = RequestValidator;
//# sourceMappingURL=validator.js.map