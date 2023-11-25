"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const mongodb_1 = require("mongodb");
const Constants_1 = __importDefault(require("../../Constants"));
const Database_1 = require("../database/Database");
const auth_1 = require("../util/auth");
const password_1 = require("../util/password");
const typedi_1 = require("typedi");
const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
};
let UserControllers = class UserControllers {
    constructor() {
        this.sendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { phone } = req.body;
            let otp = Math.floor(100000 + Math.random() * 900000).toString();
            // if (process.env.NODE_ENV != 'production') {
            otp = "123456";
            // }
            const otpDoc = yield this.database.add(Constants_1.default.COLLECTIONS.OTP, {
                phone,
                otp,
                verified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                data: {
                    requestId: otpDoc.insertedId,
                },
            });
        });
        this.verifyOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { requestId, otp } = req.body;
            const otpDoc = yield this.database.getById(Constants_1.default.COLLECTIONS.OTP, requestId);
            if (!otpDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }
            if (otpDoc.otp != otp) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }
            if (otpDoc.verified) {
                return res.status(400).json({
                    success: false,
                    message: "OTP already verified",
                });
            }
            // older than 5 minutes
            if (new Date().getTime() - otpDoc.createdAt.getTime() > 5 * 60 * 1000) {
                return res.status(400).json({
                    success: false,
                    message: "OTP expired",
                });
            }
            yield this.database.updateById(Constants_1.default.COLLECTIONS.OTP, requestId, {
                verified: true,
                updatedAt: new Date(),
            });
            const userDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                phone: otpDoc.phone,
            }, {
                name: 1,
                email: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                dob: 1,
            });
            if (userDoc) {
                const token = (0, auth_1.createAcessToken)({
                    userId: String(userDoc._id),
                    role: String(userDoc.role)
                });
                const refreshToken = (0, auth_1.createRefreshToken)({
                    userId: String(userDoc._id),
                    role: String(userDoc.role)
                });
                const responseData = {
                    oldUser: true,
                    token,
                    refreshToken,
                    user: userDoc,
                };
                if (userDoc.role === "doctor") {
                    const doctorDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                        user_id: userDoc._id,
                    });
                    if (!doctorDoc) {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid credentials",
                        });
                    }
                    responseData["doctor"] = doctorDoc;
                }
                if (userDoc.role === "patient") {
                    const patientDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                        user_id: userDoc._id,
                    });
                    if (!patientDoc) {
                        return res.status(400).json({
                            success: false,
                            message: "Invalid credentials",
                        });
                    }
                    responseData["patient"] = patientDoc;
                }
                // remove password from user object
                userDoc.password = undefined;
                return res.status(200).json({
                    success: true,
                    message: "OTP verified successfully",
                    data: responseData,
                });
            }
            else {
                const requestToken = (0, auth_1.createShortLivedToken)({
                    phone: otpDoc.phone,
                });
                return res
                    .cookie("token", requestToken, options)
                    .status(200)
                    .json({
                    success: true,
                    message: "OTP verified successfully",
                    data: {
                        newUser: true,
                        requestToken,
                    },
                });
            }
        });
        this.signUpDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("in flow jsndjfnwjdnf");
            const requestToken = req.headers["x-request-token"];
            if (!requestToken) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            const requestTokenData = (0, auth_1.verifyToken)(requestToken);
            if (!requestTokenData) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            if (!requestTokenData.type ||
                !requestTokenData.phone ||
                requestTokenData.type != "short-lived") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            const { phone } = requestTokenData;
            // check if user already exists
            const existingUserDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                phone,
            });
            if (existingUserDoc) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists",
                });
            }
            let { user } = req.body;
            let { doctor } = req.body;
            let reffered_by = null;
            const { refferal_code } = user;
            if (refferal_code) {
                const reffer = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                    own_refferal_code: refferal_code,
                }, {
                    _id: 1,
                });
                if (reffer) {
                    reffered_by = reffer[0]._id;
                }
            }
            user = Object.assign(Object.assign({}, user), { dob: user.dob ? new Date(user.dob) : null, phone, password: (0, password_1.hashPassword)(user.password), anniversary: user.anniversary ? new Date(user.anniversary) : null, role: "doctor", own_refferal_code: `${user.name}_${Math.random()
                    .toString(36)
                    .substring(2, 6)}`, reffered_by, createdAt: new Date(), updatedAt: new Date() });
            const userDoc = yield this.database.add(Constants_1.default.COLLECTIONS.USER, Object.assign({}, user));
            doctor = Object.assign(Object.assign({}, doctor), { profile_completed: false, user_id: userDoc.insertedId, createdAt: new Date(), updatedAt: new Date() });
            const doctorDoc = yield this.database.add(Constants_1.default.COLLECTIONS.DOCTOR, Object.assign({}, doctor));
            const token = (0, auth_1.createAcessToken)({
                userId: String(userDoc.insertedId),
            });
            const refreshToken = (0, auth_1.createRefreshToken)({
                userId: String(userDoc.insertedId),
            });
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                data: {
                    token,
                    refreshToken,
                    user: Object.assign(Object.assign({}, user), { _id: userDoc.insertedId }),
                    doctor: Object.assign(Object.assign({}, doctor), { _id: doctorDoc.insertedId }),
                },
            });
        });
        this.signUpPatient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const requestToken = req.headers["x-request-token"];
            if (!requestToken) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            console.log(requestToken);
            const requestTokenData = (0, auth_1.verifyToken)(requestToken);
            console.log(requestTokenData);
            if (!requestTokenData) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            if (!requestTokenData.type ||
                !requestTokenData.phone ||
                requestTokenData.type != "short-lived") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                });
            }
            const { phone } = requestTokenData;
            // check if user already exists
            const existingUserDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                phone,
            });
            if (existingUserDoc) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists",
                });
            }
            let { user } = req.body;
            let { patient } = req.body;
            let reffered_by = null;
            const { refferal_code } = user;
            if (refferal_code) {
                const reffer = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                    own_refferal_code: refferal_code,
                }, {
                    _id: 1,
                });
                if (reffer) {
                    reffered_by = reffer[0]._id;
                }
            }
            user = Object.assign(Object.assign({}, user), { dob: user.dob ? new Date(user.dob) : null, phone, password: (0, password_1.hashPassword)(user.password), role: "patient", own_refferal_code: `${user.name}_${Math.random()
                    .toString(36)
                    .substring(2, 6)}`, reffered_by, createdAt: new Date(), updatedAt: new Date() });
            const userDoc = yield this.database.add(Constants_1.default.COLLECTIONS.USER, Object.assign({}, user));
            patient = Object.assign(Object.assign({}, patient), { user_id: userDoc.insertedId, createdAt: new Date(), updatedAt: new Date() });
            const patientDoc = yield this.database.add(Constants_1.default.COLLECTIONS.PATIENT, Object.assign({}, patient));
            const token = (0, auth_1.createAcessToken)({
                userId: String(userDoc.insertedId),
            });
            const refreshToken = (0, auth_1.createRefreshToken)({
                userId: String(userDoc.insertedId),
            });
            user.password = undefined;
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                data: {
                    token,
                    refreshToken,
                    user: Object.assign(Object.assign({}, user), { _id: userDoc.insertedId }),
                    patient: Object.assign(Object.assign({}, patient), { _id: patientDoc.insertedId }),
                },
            });
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = req.body;
            const userDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                phone,
            });
            if (!userDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            if (!(0, password_1.comparePassword)(password, userDoc.password)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            const token = (0, auth_1.createAcessToken)({
                userId: String(userDoc._id),
                role: String(userDoc.role)
            });
            const refreshToken = (0, auth_1.createRefreshToken)({
                userId: String(userDoc._id),
                role: String(userDoc.role)
            });
            userDoc.password = undefined;
            const responseData = {
                token,
                refreshToken,
                user: userDoc,
            };
            if (userDoc.role === "doctor") {
                const doctorDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userDoc._id,
                });
                if (!doctorDoc) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                responseData["doctor"] = doctorDoc;
            }
            if (userDoc.role === "patient") {
                const patientDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userDoc._id,
                });
                if (!patientDoc) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                responseData["patient"] = patientDoc;
            }
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: Object.assign({}, responseData),
            });
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { oldPassword, newPassword } = req.body;
            const userDoc = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                _id: new mongodb_1.ObjectId(req.user._id),
            });
            if (!userDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            if (!(0, password_1.comparePassword)(oldPassword, userDoc.password)) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect old password",
                });
            }
            yield this.database.updateById(Constants_1.default.COLLECTIONS.USER, new mongodb_1.ObjectId(req.user._id), {
                password: (0, password_1.hashPassword)(newPassword),
                updatedAt: new Date(),
            });
            return res.status(200).json({
                success: true,
                message: "Password changed successfully",
            });
        });
        this.uploadAvatar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req === null || req === void 0 ? void 0 : req.file;
                // console.log('controller => '+userId);
                if (!file) {
                    return res.status(400).json({
                        success: false,
                        message: "No file to upload",
                    });
                }
                return res.status(200).json({
                    preSignedUrl: file.location,
                    message: "PreSigned Url Generated",
                    success: true,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
    }
};
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], UserControllers.prototype, "database", void 0);
UserControllers = __decorate([
    (0, typedi_1.Service)()
], UserControllers);
exports.default = UserControllers;
//# sourceMappingURL=auth.controller.js.map