// import { Request, Response } from 'express';
// import { RequestWithUser } from '../interfaces/request';
// import { ObjectId } from 'mongodb';
// import Constants from '../../Constants';
// import { Database } from '../database/Database';

// import { Inject, Service } from 'typedi';

// @Service()
// export default class UserControllers {
//   @Inject()
//   private database: Database;

//   public getMe = async (req: RequestWithUser, res: Response) => {
//     const user = await this.database.getById(
//       Constants.COLLECTIONS.USER,
//       String(req.user._id),
//     );
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }
//     user.password = undefined;
//     return res.status(200).json({
//       success: true,
//       user,
//     });
//   };
//   public updateMe = async (req: RequestWithUser, res: Response) => {
//     let { user } = req.body;
//     user = {
//       ...user,
//       dob: user.dob ? new Date(user.dob) : null,
//       anniversary: user.anniversary ? new Date(user.anniversary) : null,
//       own_refferal_code: `${user.name}_${Math.random().toString(36).substring(2, 6)}`,
//       updatedAt: new Date(),
//     };
//     const userDoc = await this.database.updateById(
//       Constants.COLLECTIONS.USER,
//       new ObjectId(req.user._id),
//       {
//         ...user,
//       },
//     );
//     if (!userDoc) {
//       return res.status(400).json({
//         success: false,
//         message: 'User not found',
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: 'User updated successfully',
//       data: {
//         user: {
//           ...user,
//           _id: req.user._id,
//         },
//       },
//     });
//   };
//   public addToCart = async (req: RequestWithUser, res: Response) => {
//     let cartDoc: any;
//     const { productId } = req.body;
//     const product = await this.database.getById(Constants.COLLECTIONS.PRODUCT, productId);
//     if (!product) {
//       return res.status(400).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }
//     // checl if product is already in cart
//     const cart = await this.database.getOne(Constants.COLLECTIONS.CART, {
//       userId: req.user._id,
//     });
//     if (cart) {
//       // check if product is already in cart
//       const productIndex = cart.cart_items.findIndex(
//         (item) => item.product_id === productId,
//       );
//       if (productIndex > -1) {
//         // update product quantity
//         cart.cart_items[productIndex].quantity += 1;
//         cart.total_amount += cart.cart_items[productIndex].product_price;
//       } else {
//         cart.cart_items.push({
//           product_id: product._id,
//           product_name: product.name,
//           product_price: product.price,
//           quantity: 1,
//           rating: product.rating,
//           time_required: product.time_required,
//           product_image: product.image,
//         });
//         cart.total_amount += product.price;
//       }
//       cart.updatedAt = new Date();
//       cartDoc = await this.database.updateById(
//         Constants.COLLECTIONS.CART,
//         new ObjectId(cart._id),
//         cart,
//       );
//     } else {
//       cartDoc = await this.database.add(Constants.COLLECTIONS.CART, {
//         user_id: new ObjectId(req.user._id),
//         user_name: req.user.name,
//         user_phone: req.user.phone,
//         cart_items: [
//           {
//             product_id: product._id,
//             product_name: product.name,
//             product_price: product.price,
//             quantity: 1,
//             rating: product.rating,
//             time_required: product.time_required,
//             product_image: product.image,
//           },
//         ],
//         total_amount: product.price,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: 'Product added to cart successfully',
//       data: {
//         cart: cartDoc,
//       },
//     });
//   };
//   public removeFromCart = async (req: RequestWithUser, res: Response) => {
//     const { productId } = req.body;
//     const cart = await this.database.getOne(Constants.COLLECTIONS.CART, {
//       userId: req.user._id,
//     });
//     if (!cart) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart is empty',
//       });
//     }
//     // check if product is already in cart
//     const productIndex = cart.cart_items.findIndex(
//       (item) => item.product_id === productId,
//     );
//     if (productIndex > -1) {
//       // update product quantity
//       cart.cart_items[productIndex].quantity -= 1;
//       cart.total_amount -= cart.cart_items[productIndex].product_price;
//       if (cart.cart_items[productIndex].quantity === 0) {
//         cart.cart_items.splice(productIndex, 1);
//       }
//       cart.updatedAt = new Date();
//       await this.database.updateById(
//         Constants.COLLECTIONS.CART,
//         new ObjectId(cart._id),
//         cart,
//       );
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Product not found in cart',
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: 'Product removed from cart successfully',
//       data: {
//         cart,
//       },
//     });
//   };
//   public getCart = async (req: RequestWithUser, res: Response) => {
//     const cart = await this.database.getOne(Constants.COLLECTIONS.CART, {
//       userId: req.user._id,
//     });
//     if (!cart) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart is empty',
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: {
//         cart,
//       },
//     });
//   };
//   public clearCart = async (req: RequestWithUser, res: Response) => {
//     const cart = await this.database.getOne(Constants.COLLECTIONS.CART, {
//       userId: req.user._id,
//     });
//     if (!cart) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cart is empty',
//       });
//     }
//     await this.database.delete(Constants.COLLECTIONS.CART, {
//       _id: new ObjectId(cart._id),
//     });
//     return res.status(200).json({
//       success: true,
//       message: 'Cart cleared successfully',
//     });
//   };
//   public listOrders = async (req: RequestWithUser, res: Response) => {
//     const count = await this.database.getCount(Constants.COLLECTIONS.ORDER, {
//       user_id: new ObjectId(req.user._id),
//     });

//     const page = parseInt(req.query.page as string) || 1;
//     let limit = parseInt(req.query.limit as string) || 20;
//     limit = limit > 20 ? 20 : limit;

//     const skip = (page - 1) * limit;
//     const products = await this.database.get(
//       Constants.COLLECTIONS.ORDER,
//       {
//         status: 'available',
//       },
//       'createdAt',
//       false,
//       limit,
//       skip,
//       {
//         _id: 1,
//         name: 1,
//         price: 1,
//         description: 1,
//         image: 1,
//       },
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Products fetched successfully',
//       data: products,
//       pagination: {
//         currentPage: page,
//         pageSize: products.length,
//         pageLimit: limit,
//         totalCount: count,
//         TotalPages: Math.ceil(count / limit),
//       },
//     });
//   };
//   public get = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const product = await this.database.getById(Constants.COLLECTIONS.PRODUCT, id);
//     if (!product) {
//       return res.status(400).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: 'Product fetched successfully',
//       data: product,
//     });
//   };
//   public search = async (req: Request, res: Response) => {
//     const search = req.query.query as string;
//     const { filters } = req.body;
//     const regex = new RegExp(search, 'i');
//     const query = {
//       status: 'available',
//       $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
//     } as any;

//     if (filters && Object.keys(filters).length > 0) {
//       if (filters.priceMin || filters.priceMax) {
//         query.price = {};
//         if (filters.priceMin) {
//           query.price.$gte = filters.priceMin;
//         }
//         if (filters.priceMax) {
//           query.price.$lte = filters.priceMax;
//         }
//       }
//       if (filters.ratingMin) {
//         query.rating = { $gte: filters.ratingMin };
//       }
//       if (filters.categoryId) {
//         query.categoryId = new ObjectId(filters.categoryId);
//       }
//       if (filters.subCategoryId) {
//         query.subCategoryId = new ObjectId(filters.subCategoryId());
//       }
//     }

//     const count = await this.database.getCount(Constants.COLLECTIONS.PRODUCT, query);

//     const page = parseInt(req.query.page as string) || 1;
//     let limit = parseInt(req.query.limit as string) || 20;
//     limit = limit > 20 ? 20 : limit;

//     const skip = (page - 1) * limit;
//     const products = await this.database.get(
//       Constants.COLLECTIONS.PRODUCT,
//       query,
//       'createdAt',
//       false,
//       limit,
//       skip,
//       {
//         _id: 1,
//         name: 1,
//         price: 1,
//         description: 1,
//         image: 1,
//       },
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Products fetched successfully',
//       data: products,
//       pagination: {
//         currentPage: page,
//         pageSize: products.length,
//         pageLimit: limit,
//         totalCount: count,
//         TotalPages: Math.ceil(count / limit),
//       },
//     });
//   };
// }
