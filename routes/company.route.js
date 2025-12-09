import express from "express";
import { getAllCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import authenticateToken from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register",authenticateToken,registerCompany);
router.put("/update/:id",authenticateToken,updateCompany);
router.get("/getAll",authenticateToken,getAllCompany);
router.get("/get/:id",authenticateToken,getCompanyById);


export default router;

