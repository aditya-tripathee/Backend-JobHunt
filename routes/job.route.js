import express from "express";
import { getAdminJob, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import authenticateToken from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.post("/post",authenticateToken,postJob);
router.get("/get",authenticateToken,getAllJobs);
router.get("/get/:id",authenticateToken,getJobById);
router.get("/admin/jobs",authenticateToken,getAdminJob);

export default router;
