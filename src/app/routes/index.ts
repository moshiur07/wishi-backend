import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
    res.send("Test route working");
})

export default router;