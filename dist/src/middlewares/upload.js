"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importStar(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const Database_1 = require("../database/Database");
const path_1 = __importDefault(require("path"));
const database = new Database_1.Database();
const s3 = new aws_sdk_1.default.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});
s3.listBuckets((err, data) => {
    if (err) {
        console.error('Error:', err);
    }
    else {
        console.log('S3 Client Bucket Using:', data.Buckets[0].Name);
    }
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        endpoint: process.env.S3_ENDPOINT,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = req.params.userId;
                const user = yield database.getById('user', userId);
                // console.log(user);
                const userRole = user === null || user === void 0 ? void 0 : user.role;
                const fieldName = req.params.fieldName;
                let folderName = '';
                if (userRole === 'patient') {
                    folderName = `patient/${userId}/`;
                }
                else if (userRole === 'doctor') {
                    folderName = `doctor/${userId}/`;
                }
                // console.log(file);
                const fileExtension = path_1.default.extname(file.originalname);
                const s3Key = folderName + fieldName + fileExtension;
                // console.log(s3Key);
                cb(null, s3Key);
            });
        }
    })
});
function customUploadMiddleware(key) {
    return function (req, res, next) {
        console.log('Additional parameter:', key);
        upload.single(key)(req, res, function (error) {
            if (error instanceof multer_1.MulterError) {
                return res.status(400).json({ error: error.message });
            }
            else if (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
            next();
        });
    };
}
exports.default = customUploadMiddleware;
//# sourceMappingURL=upload.js.map