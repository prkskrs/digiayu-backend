import { Request, Response } from "express";
import { RequestWithUser } from "../interfaces/request";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import {
  createAcessToken,
  createRefreshToken,
  verifyToken,
  createShortLivedToken,
} from "../util/auth";
import { hashPassword, comparePassword } from "../util/password";

import { Inject, Service } from "typedi";

const options = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
};

interface MulterRequest extends Request {
  file: any;
}

@Service()
export default class UserControllers {
  @Inject()
  private database: Database;

  public sendOTP = async (req: Request, res: Response) => {
    const { phone } = req.body;
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    // if (process.env.NODE_ENV != 'production') {
    otp = "123456";
    // }
    const otpDoc = await this.database.add(Constants.COLLECTIONS.OTP, {
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
  };

  public verifyOTP = async (req: Request, res: Response) => {
    const { requestId, otp } = req.body;
    const otpDoc = await this.database.getById(
      Constants.COLLECTIONS.OTP,
      requestId,
    );
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
    await this.database.updateById(Constants.COLLECTIONS.OTP, requestId, {
      verified: true,
      updatedAt: new Date(),
    });
    const userDoc = await this.database.getOne(
      Constants.COLLECTIONS.USER,
      {
        phone: otpDoc.phone,
      },
      {
        name: 1,
        email: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        dob: 1,
      },
    );
    if (userDoc) {
      const token = createAcessToken({
        userId: String(userDoc._id),
        role: String(userDoc.role),
      });
      const refreshToken = createRefreshToken({
        userId: String(userDoc._id),
        role: String(userDoc.role),
      });

      const responseData = {
        oldUser: true,
        token,
        refreshToken,
        user: userDoc,
      };

      if (userDoc.role === "doctor") {
        const doctorDoc = await this.database.getOne(
          Constants.COLLECTIONS.DOCTOR,
          {
            user_id: userDoc._id,
          },
        );
        if (!doctorDoc) {
          return res.status(400).json({
            success: false,
            message: "Invalid credentials",
          });
        }
        responseData["doctor"] = doctorDoc;
      }

      if (userDoc.role === "patient") {
        const patientDoc = await this.database.getOne(
          Constants.COLLECTIONS.PATIENT,
          {
            user_id: userDoc._id,
          },
        );
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
    } else {
      const requestToken = createShortLivedToken({
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
  };

  public signUpDoctor = async (req: Request, res: Response) => {
    console.log("in flow jsndjfnwjdnf");
    const requestToken = req.headers["x-request-token"];
    if (!requestToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    const requestTokenData = verifyToken(requestToken as string);
    if (!requestTokenData) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    if (
      !requestTokenData.type ||
      !requestTokenData.phone ||
      requestTokenData.type != "short-lived"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    const { phone } = requestTokenData;
    // check if user already exists
    const existingUserDoc = await this.database.getOne(
      Constants.COLLECTIONS.USER,
      {
        phone,
      },
    );
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
      const reffer = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          own_refferal_code: refferal_code,
        },
        {
          _id: 1,
        },
      );
      if (reffer) {
        reffered_by = reffer[0]._id;
      }
    }

    user = {
      ...user,
      dob: user.dob ? new Date(user.dob) : null,
      phone,
      password: hashPassword(user.password),
      anniversary: user.anniversary ? new Date(user.anniversary) : null,
      role: "doctor",
      own_refferal_code: `${user.name}_${Math.random()
        .toString(36)
        .substring(2, 6)}`,
      reffered_by,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDoc = await this.database.add(Constants.COLLECTIONS.USER, {
      ...user,
    });

    doctor = {
      ...doctor,
      profile_completed: false,
      user_id: userDoc.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doctorDoc = await this.database.add(Constants.COLLECTIONS.DOCTOR, {
      ...doctor,
    });

    const token = createAcessToken({
      userId: String(userDoc.insertedId),
    });
    const refreshToken = createRefreshToken({
      userId: String(userDoc.insertedId),
    });
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        refreshToken,
        user: {
          ...user,
          _id: userDoc.insertedId,
        },
        doctor: {
          ...doctor,
          _id: doctorDoc.insertedId,
        },
      },
    });
  };

  public signUpPatient = async (req: Request, res: Response) => {
    const requestToken = req.headers["x-request-token"];
    if (!requestToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    console.log(requestToken);

    const requestTokenData = verifyToken(requestToken as string);
    console.log(requestTokenData);

    if (!requestTokenData) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    if (
      !requestTokenData.type ||
      !requestTokenData.phone ||
      requestTokenData.type != "short-lived"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    const { phone } = requestTokenData;
    // check if user already exists
    const existingUserDoc = await this.database.getOne(
      Constants.COLLECTIONS.USER,
      {
        phone,
      },
    );
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
      const reffer = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          own_refferal_code: refferal_code,
        },
        {
          _id: 1,
        },
      );
      if (reffer) {
        reffered_by = reffer[0]._id;
      }
    }

    user = {
      ...user,
      dob: user.dob ? new Date(user.dob) : null,
      phone,
      password: hashPassword(user.password),
      role: "patient",
      own_refferal_code: `${user.name}_${Math.random()
        .toString(36)
        .substring(2, 6)}`,
      reffered_by,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDoc = await this.database.add(Constants.COLLECTIONS.USER, {
      ...user,
    });

    patient = {
      ...patient,
      user_id: userDoc.insertedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const patientDoc = await this.database.add(Constants.COLLECTIONS.PATIENT, {
      ...patient,
    });

    const token = createAcessToken({
      userId: String(userDoc.insertedId),
    });
    const refreshToken = createRefreshToken({
      userId: String(userDoc.insertedId),
    });
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        refreshToken,
        user: {
          ...user,
          _id: userDoc.insertedId,
        },
        patient: {
          ...patient,
          _id: patientDoc.insertedId,
        },
      },
    });
  };

  public login = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const userDoc = await this.database.getOne(Constants.COLLECTIONS.USER, {
      phone,
    });
    if (!userDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (!comparePassword(password, userDoc.password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = createAcessToken({
      userId: String(userDoc._id),
      role: String(userDoc.role),
    });
    const refreshToken = createRefreshToken({
      userId: String(userDoc._id),
      role: String(userDoc.role),
    });
    userDoc.password = undefined;

    const responseData = {
      token,
      refreshToken,
      user: userDoc,
    };

    if (userDoc.role === "doctor") {
      const doctorDoc = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userDoc._id,
        },
      );
      if (!doctorDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      responseData["doctor"] = doctorDoc;
    }

    if (userDoc.role === "patient") {
      const patientDoc = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userDoc._id,
        },
      );
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
      data: {
        ...responseData,
      },
    });
  };
  public changePassword = async (req: RequestWithUser, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const userDoc = await this.database.getOne(Constants.COLLECTIONS.USER, {
      _id: new ObjectId(req.user._id),
    });
    if (!userDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (!comparePassword(oldPassword, userDoc.password)) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }
    await this.database.updateById(
      Constants.COLLECTIONS.USER,
      new ObjectId(req.user._id),
      {
        password: hashPassword(newPassword),
        updatedAt: new Date(),
      },
    );
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  };

  public uploadAvatar = async (req: MulterRequest, res: Response) => {
    try {
      const file = req?.file;
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
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };
}
