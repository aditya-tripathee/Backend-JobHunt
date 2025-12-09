import Application from "../models/application.model.js";
import Job from "../models/job.model.js"

export const applyJob = async(req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Invalid job id",
                success:false
            })
        }

        // check if the user already has applied for this job
        const existingApplication = await Application.findOne({
            job : jobId,
            applicant : userId
        });

        if(existingApplication){
            return res.status(400).json({
                message:"You are already applied for this job",
                success:false
            })
        };

        // check if the job exits 
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        };

        const application = await Application.create({
            job : jobId,
            applicant : userId,
        });

        await application.save();
        job.applications.push(application._id);
        await job.save();
        

        return res.status(201).json({
            message:"Application submitted",
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Internal problem ",
            success:false
        })
    }
};


export const getAppliedJobs = async(req,res)=>{
    try {
        const userId = req.id;
        const applications = await Application.find({applicant:userId}).sort({createdAt:-1})
        .populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",options:{sort:{createdAt:-1}}
        }});
        
        if(!applications){
            return res.status(400).json({
                message:"Not found",
                success:false
            })
        };


        return res.status(200).json({
            message:"Applications find",
            applications,
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Internal server problem"
        })
    }
}


export const getApplicants = async(req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"application",
            options:{sort:{createdAt:-1}},
            populate:{path:"applicant",options:{sort:{createdAt:-1}}}
        });
        
        if(!job){
            return res.status(400).json({
                message:"No job found",
                success:true
            })
        }

        return res.status(200).json({
            message:"Job found",
            job,
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Internal server problem",
            success:false
        })
    }
};


export const updateStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Invalid status",
                success:false
            })
        };

        const application = await Application.findById({_id:applicationId});
        if(!application){
            return res.status(400).json({
                message:"Application not found",
                success:false
            })
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Application status updated",
            application,
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Internal problem ",
            success:false
        })
    }
}

