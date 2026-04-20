import { Router } from "express";
import { OccasionController } from "./occasion.controller";
import validateRequest from "../../middleware/validateRequest";
import { OccasionValidation } from "./occasion.validation";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/",
    auth(Role.USER),
    validateRequest(OccasionValidation.createOccasionSchema),
    OccasionController.createOccasion
);

router.get(
    "/",
    auth(Role.USER),
    OccasionController.getMyOccasions
);

router.get(
    "/:id",
    auth(Role.USER),
    OccasionController.getOccasionById
);

router.patch(
    "/:id",
    auth(Role.USER),
    validateRequest(OccasionValidation.updateOccasionSchema),
    OccasionController.updateOccasion
);

router.delete(
    "/:id",
    auth(Role.USER),
    OccasionController.deleteOccasion
);

export const OccasionRoutes = router;
