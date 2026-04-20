import { Router } from "express";
import { ContributionController } from "./contribution.controller";
import validateRequest from "../../middleware/validateRequest";
import { ContributionValidation } from "./contribution.validation";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = Router();

router.post(
    "/",
    validateRequest(ContributionValidation.createContributionSchema),
    ContributionController.createContribution
);

router.get(
    "/my-contributions",
    auth(Role.USER),
    ContributionController.getMyContributions
);

router.get(
    "/:wishItemId",
    ContributionController.getContributionsByWishItem
);

export const ContributionRoutes = router;
