import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import validateRequest from "../../middleware/validateRequest";
import { WishlistValidation } from "./wishlist.validation";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/",
    auth(Role.USER),
    validateRequest(WishlistValidation.createWishItemSchema),
    WishlistController.createWishItem
);

router.get(
    "/",
    auth(Role.USER),
    WishlistController.getMyWishItems
);

router.get(
    "/public/:username",
    WishlistController.getPublicWishlist
);

router.get(
    "/:id",
    auth(Role.USER),
    WishlistController.getWishItemById
);

router.patch(
    "/:id",
    auth(Role.USER),
    validateRequest(WishlistValidation.updateWishItemSchema),
    WishlistController.updateWishItem
);

router.patch(
    "/:id/toggle-pin",
    auth(Role.USER),
    WishlistController.togglePinStatus
);

router.delete(
    "/:id",
    auth(Role.USER),
    WishlistController.deleteWishItem
);

export const WishlistRoutes = router;
