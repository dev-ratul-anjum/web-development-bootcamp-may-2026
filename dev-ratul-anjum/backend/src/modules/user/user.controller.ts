import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import userService from "./user.service.js";
import { createJwtToken, setAuthCookie } from "$/utils/authHelpers.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { uploadToCloudinary } from "$/utils/fileUploader.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const newUser = await userService.registerUser(req.body, req.file);
  const token = createJwtToken(newUser.id);
  setAuthCookie(res, token);

  return responseHandler(res, 201, {
    success: true,
    message: "User Registered Successfully!",
  });
});

const getUsersForAddNewChat = catchAsync(
  async (req: Request, res: Response) => {
    let { query, page } = req.query;

    if (!query || typeof query !== "string") {
      throw new ApiError(400, "Required query not provided");
    }
    const pageNumber =
      typeof page === "string" && !isNaN(Number(page))
        ? Number(page)
        : undefined;

    const userId = req.user?.id;

    const data = await userService.getUsersForAddNewChat(
      userId!,
      query,
      pageNumber,
    );

    return responseHandler(res, 200, {
      success: true,
      message: "Users retrive successfull!",
      data,
    });
  },
);

// Update User Profile
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  let photo: undefined | string = undefined;
  if (req.file) {
    const result = await uploadToCloudinary(req.file);
    photo = result.secure_url;
  }

  const userId = req.user?.id;

  await userService.updateUserProfile(userId!, req.body, photo);

  return responseHandler(res, 200, {
    success: true,
    message: "Profile updated successfull!",
  });
});

// Block User
const blockUser = catchAsync(async (req: Request, res: Response) => {
  const blockerId = req.user?.id;
  const blockedId = req.params.blockedId;

  if (!blockedId || typeof blockedId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }

  await userService.blockUser(blockerId!, blockedId);

  return responseHandler(res, 200, {
    success: true,
    message: "Blocked successfull!",
  });
});

// Unblock User
const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const blockerId = req.user?.id;
  const blockedId = req.params.blockedId;

  if (!blockedId || typeof blockedId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }

  await userService.unblockUser(blockerId!, blockedId);

  return responseHandler(res, 200, {
    success: true,
    message: "Unblocked successfull!",
  });
});

// Check Block User
const checkBlockUser = catchAsync(async (req: Request, res: Response) => {
  const blockerId = req.user?.id;
  const blockedId = req.params.blockedId;

  if (!blockedId || typeof blockedId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }

  const data = await userService.checkBlockUser(blockerId!, blockedId);

  return responseHandler(res, 200, {
    success: true,
    message: "Check Blocked successfull!",
    data,
  });
});

// Report User
const reportUser = catchAsync(async (req: Request, res: Response) => {
  const reporterId = req.user?.id;
  const reportedUserId = req.params.reportedUserId;

  if (!reportedUserId || typeof reportedUserId !== "string") {
    throw new ApiError(400, "Required parameters not provided");
  }

  await userService.reportUser(reporterId!, reportedUserId);

  return responseHandler(res, 200, {
    success: true,
    message: "Report successfull!",
  });
});

const userController = {
  registerUser,
  getUsersForAddNewChat,
  updateUserProfile,
  blockUser,
  unblockUser,
  checkBlockUser,
  reportUser,
};

export default userController;
