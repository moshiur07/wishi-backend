import { Router } from "express";
import { WishlistRoutes } from "../modules/wishlist/wishlist.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { OccasionRoutes } from "../modules/occasion/occasion.routes";
import { ContributionRoutes } from "../modules/contribution/contribution.routes";
import { AIRoutes } from "../modules/ai/ai.routes";

const router = Router();

router.get("/test", (req, res) => {
    res.send("Test route working");
});

const moduleRoutes = [
    {
        path: "/wishlist",
        route: WishlistRoutes,
    },
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/occasions",
        route: OccasionRoutes,
    },
    {
        path: "/contributions",
        route: ContributionRoutes,
    },
    {
        path: "/ai",
        route: AIRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;