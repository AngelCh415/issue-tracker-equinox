import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
    const { email } = req.body;
    return res.json({
        user:{ id: 1, name: "Demo user", email },
        token: "fake-jwt-token"
    });
});

export default router;