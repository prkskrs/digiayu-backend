import { Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/request';
import { ObjectId } from 'mongodb';
import Constants from '../../Constants';
import { Database } from '../database/Database';
import {
  createAcessToken,
  createRefreshToken,
  verifyToken,
  createShortLivedToken,
} from '../util/auth';
import { hashPassword, comparePassword } from '../util/password';

import { Inject, Service } from 'typedi';

@Service()
export default class ProductControllers {
  @Inject()
  private database: Database;

  public create = async (req: RequestWithUser, res: Response) => {
    const { name, price, description, image, category_name, sub_category_name, status, category_id, sub_category_id } = req.body;

    const productNew = {
      name,
      price,
      description,
      status: status ? status : 'available',
      image,
      category_id: new ObjectId(category_id),
      category_name: category_name,
      sub_category_id: new ObjectId(sub_category_id),
      sub_category_name: sub_category_name,
      time_required: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product = await this.database.add(Constants.COLLECTIONS.PRODUCT, { ...productNew });

    return res.status(200).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  };
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

  public list = async (req: Request, res: Response) => {
    const count = await this.database.getCount(Constants.COLLECTIONS.PRODUCT, {
      status: 'available',
    });

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 20;
    limit = limit > 20 ? 20 : limit;

    const skip = (page - 1) * limit;
    const products = await this.database.get(
      Constants.COLLECTIONS.PRODUCT,
      {
        status: 'available',
      },
      'createdAt',
      false,
      limit,
      skip,
      {
        _id: 1,
        name: 1,
        price: 1,
        description: 1,
        image: 1,
      },
    );

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
  };
  public get = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.database.getById(Constants.COLLECTIONS.PRODUCT, id);
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
  };
  public search = async (req: Request, res: Response) => {
    const search = req.query.query as string;
    const { filters } = req.body;
    const regex = new RegExp(search, 'i');
    const query = {
      status: 'available',
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    } as any;

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
        query.categoryId = new ObjectId(filters.categoryId);
      }
      if (filters.subCategoryId) {
        query.subCategoryId = new ObjectId(filters.subCategoryId());
      }
    }

    const count = await this.database.getCount(Constants.COLLECTIONS.PRODUCT, query);

    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 20;
    limit = limit > 20 ? 20 : limit;

    const skip = (page - 1) * limit;
    const products = await this.database.get(
      Constants.COLLECTIONS.PRODUCT,
      query,
      'createdAt',
      false,
      limit,
      skip,
      {
        _id: 1,
        name: 1,
        price: 1,
        description: 1,
        image: 1,
      },
    );

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
  };
}
