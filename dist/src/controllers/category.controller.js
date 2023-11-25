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
let CategoryControllers = class CategoryControllers {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, time_required } = req.body;
            const productNew = {
                name,
                time_required: time_required,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const category = yield this.database.add(Constants_1.default.COLLECTIONS.CATEGORY, Object.assign({}, productNew));
            return res.status(200).json({
                success: true,
                message: 'Category created successfully',
                data: category,
            });
        });
        // public update = async (req: RequestWithUser, res: Response) => {
        //   const { id } = req.params;
        //   const { name, price, description, image, categoryId, subCategoryId } = req.body;
        //   const product = await this.database.updateById(
        //     Constants.COLLECTIONS.PRODUCT,
        //     id,
        //     {
        //       name,
        //       price,
        //       description,
        //       image,
        //       categoryId: new ObjectId(categoryId),
        //       subCategoryId: new ObjectId(subCategoryId),
        //       status: 'available',
        //       updatedAt: new Date(),
        //     },
        //   );
        //   return res.status(200).json({
        //     success: true,
        //     message: 'Product updated successfully',
        //     data: product,
        //   });
        // };
        this.list = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const count = yield this.database.getCount(Constants_1.default.COLLECTIONS.CATEGORY, {
            //   status: 'available',
            });
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 20;
            limit = limit > 20 ? 20 : limit;
            const skip = (page - 1) * limit;
            const category = yield this.database.get(Constants_1.default.COLLECTIONS.CATEGORY, {
            // status: 'available',
            }, 'createdAt', false, limit, skip, {
                _id: 1,
                time_required: 1,
            });
            return res.status(200).json({
                success: true,
                message: 'Category fetched successfully',
                data: category,
                pagination: {
                    currentPage: page,
                    pageSize: category.length,
                    pageLimit: limit,
                    totalCount: count,
                    TotalPages: Math.ceil(count / limit),
                },
            });
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield this.database.getById(Constants_1.default.COLLECTIONS.PRODUCT, id);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Product fetched successfully',
                data: product,
            });
        });
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const search = req.query.query;
            const { filters } = req.body;
            const regex = new RegExp(search, 'i');
            const query = {
                status: 'available',
                $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
            };
            if (filters && Object.keys(filters).length > 0) {
                if (filters.priceMin || filters.priceMax) {
                    query.price = {};
                    if (filters.priceMin) {
                        query.price.$gte = filters.priceMin;
                    }
                    if (filters.priceMax) {
                        query.price.$lte = filters.priceMax;
                    }
                }
                if (filters.ratingMin) {
                    query.rating = { $gte: filters.ratingMin };
                }
                if (filters.categoryId) {
                    query.categoryId = new mongodb_1.ObjectId(filters.categoryId);
                }
                if (filters.subCategoryId) {
                    query.subCategoryId = new mongodb_1.ObjectId(filters.subCategoryId());
                }
            }
            const count = yield this.database.getCount(Constants_1.default.COLLECTIONS.PRODUCT, query);
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 20;
            limit = limit > 20 ? 20 : limit;
            const skip = (page - 1) * limit;
            const products = yield this.database.get(Constants_1.default.COLLECTIONS.PRODUCT, query, 'createdAt', false, limit, skip, {
                _id: 1,
                name: 1,
                price: 1,
                description: 1,
                image: 1,
            });
            return res.status(200).json({
                success: true,
                message: 'Products fetched successfully',
                data: products,
                pagination: {
                    currentPage: page,
                    pageSize: products.length,
                    pageLimit: limit,
                    totalCount: count,
                    TotalPages: Math.ceil(count / limit),
                },
            });
        });
    }
};
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], CategoryControllers.prototype, "database", void 0);
CategoryControllers = __decorate([
    (0, typedi_1.Service)()
], CategoryControllers);
exports.default = CategoryControllers;
//# sourceMappingURL=category.controller.js.map