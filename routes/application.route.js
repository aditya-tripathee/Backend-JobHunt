import express from "express";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicant.controller.js";
import authenticateToken from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.post("/apply/:id",authenticateToken,applyJob);
router.get("/get",authenticateToken,getAppliedJobs);
router.get("/:id/applicants",authenticateToken,getApplicants);
router.post("/status/:id/update",authenticateToken,updateStatus);



export default router