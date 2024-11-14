import { Request, Response } from "express";
import { signinValidation } from "../../../utils/validations";
import { UserInterface } from "../../../types";
import userModel from "../../../models/userModel";
import { signToken } from "../../../utils/jsonwebtoken";
import rankModel from "../../../models/rankModel";

export const signin = async (req: Request, res: Response) => {
//   REQUEST BODY VALIDATION
    const { error } = signinValidation(req.body)
   if(error) {
     res.status(400).json({
        success: false,
        message: error.details[0].message
       })
       return
   }
// CHECKING IF USER EXISTS
   let points = 0
   const { address, balance, twitterHandle, twitterUsername, profilePhoto }: UserInterface = req.body

    const rank = await rankModel.findOne({
        $and: [
            {
                $expr: {
                    $lte: [balance, "$max_army"],
                    // $gte: ["$min_army", balance]
                }
            },
            {
                $expr: {
                    // $lte: [balance, "$max_army"],
                    $gte: [balance, "$min_army"]
                }
            }
        ]
    });

      console.log(rank, "rank");
      
     
    if(rank) {
        points = rank.multiplier * Number(process.env.ARMY_DAILY_MULTIPLIER)
    }



   const userExits = await userModel.findOne({ address }).populate('rank')
   if(userExits) {
    await userModel.updateOne({ address }, {
        $set: {
            twitterHandle,
            twitterUsername,
            profilePhoto,
            ...( rank && {rank: rank?._id})
        },
        $inc: {
            points
        }
    })
    
    const token = signToken({ _id: userExits._id, address: address, accessLevel: userExits.accessLevel })
     res.status(200).json({
        success: true,
        user: userExits,
        token
    })
     return
   }
// CREATE USER ACCOUNT 
    const user = await userModel.create({
        ...req.body, 
        points, 
        ...(rank && { rank })
    })
    const token = signToken({ _id: user._id, address: address, accessLevel: user.accessLevel })
    res.status(200).json({
        success: true,
        user,
        token
    })

}

export const getUserProfile = async (req: Request, res: Response) => {
// @ts-ignore
 const user = await userModel.findById(req.user._id).populate('rank');
    if(!user) {
        res.status(404).json({ success: false, message: 'User not found' })
        return 
    }
    res.status(200).json({ success: true, user })
}

export const getRanks = async (req: Request, res: Response) => {
    const ranks = await rankModel.find().sort({ mutilplier: -1 });
    res.status(200).json({ 
        success: true,
        message: "ranks fetched successfully",
        ranks
     })
}

export const getLeaderboard = async (req: Request, res: Response) => {
    const leaderboard = await userModel.find().populate("rank").sort({ points: -1 }).sort({ "rank.multiplier": -1 });
    res.status(200).json({ 
        success: true, 
        message: "leaderboard fetched successfully",
        leaderboard 
    })
}