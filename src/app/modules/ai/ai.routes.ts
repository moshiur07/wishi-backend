import { Router } from "express";
import { AIController } from "./ai.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/suggestions",
    auth(Role.USER),
    AIController.getSuggestions
);

export const AIRoutes = router;
