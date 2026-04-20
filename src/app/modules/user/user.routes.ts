import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/me",
    auth(Role.USER, Role.ADMIN),
    UserController.getMyProfile
);

router.get(
    "/dashboard-stats",
    auth(Role.USER, Role.ADMIN),
    UserController.getDashboardStats
);

router.patch(
    "/me",
    auth(Role.USER, Role.ADMIN),
    validateRequest(UserValidation.updateProfileSchema),
    UserController.updateProfile
);

router.get(
    "/public/:username",
    UserController.getPublicProfile
);

export const UserRoutes = router;
