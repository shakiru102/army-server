import { Request, Response } from "express";
import { accessLevelValidation, rankValidation } from "../../../utils/validations";
import rankModel from "../../../models/rankModel";
import userModel from "../../../models/userModel";

export const createRank = async (req: Request, res: Response) => {
     const { error } = rankValidation(req.body)
     if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
     }
     if(req.body.min_army > req.body.max_army) {
        res.status(400).json({
            success: false,
            message: "Minimum army cannot be greater than maximum army"
        })
        return
     }

     try {
      const rank = await rankModel.create(req.body)
       res.status(201).json({
            success: true,
            message: "Rank created successfully",
            rank
       }) 
     } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
     }
}
export const updateRank = async (req: Request, res: Response) => {
    const { error } = rankValidation(req.body)
    if(error) {
       res.status(400).json({
           success: false,
           message: error.details[0].message
       })
       return
    }
    if(req.body.min_army > req.body.max_army) {
       res.status(400).json({
           success: false,
           message: "Minimum army cannot be greater than maximum army"
       })
       return
    }

    try {
      await rankModel.updateOne({ _id: req.params.id },{...req.body})
      res.status(201).json({
           success: true,
           message: "Rank updated successfully",
           
      }) 
    } catch (error: any) {
       res.status(400).json({
           success: false,
           message: error.message
       })
    }
}

export const updateAccessLevel = async (req: Request, res: Response) => {
   
    const { error } = accessLevelValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }
// @ts-ignore
    if(req.body.accessLevel !== "super admin" && req.body.userId == req.user._id) {
        
        
        const admins = await userModel.find({ accessLevel: "super admin" })
        if(admins.length < 2) {
                res.status(400).json({
                    success: false,
                    message: "You cannot update access level of your own account or there must be at least 2 super admins"
                })
                return
        }
    }

    try {
       await userModel.updateOne({ _id: req.body.userId },{ accessLevel: req.body.accessLevel })
       res.status(201).json({
            success: true,
            message: "Access level updated successfully",
            
       }) 
    } catch (error: any) {
       res.status(400).json({
            success: false,
            message: error.message
       })
    }

}