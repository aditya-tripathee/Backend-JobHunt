import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      position,
      companyId,
      experience,
      jobType,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !position ||
      !companyId ||
      !experience ||
      !jobType
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

     const requirementsArray = typeof requirements === "string"
      ? requirements.split(",").map(r => r.trim())
      : Array.isArray(requirements)
        ? requirements
        : [];


    let job = await Job.create({
      title,
      description,
      salary: Number(salary),
      location,
      experience,
      requirements: requirementsArray,
      position,
      company: companyId,
      jobType,
      created_by: userId,
    });

    return res.status(201).json({
      message: "Job post successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal problem",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
        { position: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { jobType: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query); 


    if (!jobs) {
      return res.status(400).json({
        message: "No jobs found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Job found",
      jobs,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Sever problem",
      success: false,
    });
  }
};

export const getJobById = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                message:"Job not found"
            })
        };

        return res.status(200).json({
            job,
            status:true    
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

export const getAdminJob = async(req,res)=>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(400).json({
                message:"Not job found",
                status:false
            })
        };

        return res.status(200).json({
            message:"Job found",
            jobs,
            success:true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server problem",
            success:false
        })
    }
}

