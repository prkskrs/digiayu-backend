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
const typedi_1 = require("typedi");
const auth_1 = require("../util/auth");
class ChatController {
    constructor() {
        this.getAllChats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.query;
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
                if (!requestTokenData.userId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                // console.log(userId);
                let doctor_id, patient_id, common_id = null;
                let role = null;
                const patientExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userId,
                });
                if (patientExists) {
                    patient_id = patientExists === null || patientExists === void 0 ? void 0 : patientExists._id;
                }
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (doctorExists) {
                    doctor_id = doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id;
                }
                const query = {};
                if (patient_id) {
                    query.patient_id = new mongodb_1.ObjectId(patient_id.toString());
                }
                if (doctor_id) {
                    query.doctor_id = new mongodb_1.ObjectId(doctor_id.toString());
                }
                if (status) {
                    query.status = status;
                }
                console.log(query);
                const chats = yield this.database.aggregate("chat", [
                    { $match: query },
                    {
                        $lookup: {
                            from: "patient",
                            localField: "patient_id",
                            foreignField: "_id",
                            as: "patient",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctor",
                            localField: "doctor_id",
                            foreignField: "_id",
                            as: "doctor",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            status: 1,
                            patient_id: 1,
                            doctor_id: 1,
                            patient: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                phone: 1,
                                avatar: 1
                            },
                            doctor: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                mobile: 1,
                                profile_image: 1,
                            },
                        },
                    },
                ]);
                return res.status(200).json({
                    success: true,
                    message: "All Doctors",
                    data: { chats },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getChatMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
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
                if (!requestTokenData.userId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const condition = {};
                const chatId = req.params.id;
                console.log(chatId);
                const chat = yield this.database.get("chat_message", {
                    chat_id: new mongodb_1.ObjectId(chatId.toString()),
                });
                return res.status(200).json({
                    success: true,
                    message: "All chat Messages",
                    data: { message: chat },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.sendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, sender_id, receiver_id, doctor_id, patient_id } = req.body;
                if (!message || !sender_id || !receiver_id || !doctor_id || !patient_id) {
                    return res.status(400).json({
                        success: false,
                        message: "Bad request",
                    });
                }
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
                if (!requestTokenData.userId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                // console.log(requestTokenData);
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const role = requestTokenData.role;
                // console.log(requestTokenData);
                const chatExist = yield this.database.getOne("chat", {
                    doctor_id: new mongodb_1.ObjectId(doctor_id),
                    patient_id: new mongodb_1.ObjectId(patient_id),
                });
                // console.log(chatExist);
                const chat_id = chatExist === null || chatExist === void 0 ? void 0 : chatExist._id;
                if (!chat_id) {
                    const chat = yield this.database.add("chat", {
                        doctor_id: new mongodb_1.ObjectId(doctor_id),
                        patient_id: new mongodb_1.ObjectId(patient_id),
                        status: "active",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    if (chat) {
                        const chatId = chat === null || chat === void 0 ? void 0 : chat.insertedId;
                        const chatMessage = yield this.database.add("chat_message", {
                            chat_id: new mongodb_1.ObjectId(chatId),
                            message,
                            sender_id: new mongodb_1.ObjectId(sender_id),
                            receiver_id: new mongodb_1.ObjectId(receiver_id),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            status: "sent",
                        });
                        if (chatMessage) {
                            return res.status(200).json({
                                success: true,
                                message: "Message sent successfully",
                                data: { chatMessage },
                            });
                        }
                    }
                }
                else {
                    // console.log("chat exist");
                    const chatMessage = yield this.database.add("chat_message", {
                        chat_id: new mongodb_1.ObjectId(chat_id),
                        message,
                        sender_id: new mongodb_1.ObjectId(sender_id),
                        receiver_id: new mongodb_1.ObjectId(receiver_id),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        status: "sent",
                    });
                    if (chatMessage) {
                        return res.status(200).json({
                            success: true,
                            message: "Message sent successfully",
                            data: { chatMessage },
                        });
                    }
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.updateChat = (req, res) => __awaiter(this, void 0, void 0, function* () { });
    }
}
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], ChatController.prototype, "database", void 0);
exports.default = ChatController;
//# sourceMappingURL=chat.controller.js.map