import { Request, Response } from "express";
import { signinValidation } from "../../../utils/validations";
import { UserInterface } from "../../../types";
import userModel from "../../../models/userModel";
import { signToken } from "../../../utils/jsonwebtoken";
import rankModel from "../../../models/rankModel";
import campaignModel from "../../../models/campaignModel";
import tagModel from "../../../models/tagModel";
import { populate } from "dotenv";

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

      
     
    



   const userExits = await userModel.findOne({
    $or: [
        { twitterHandle },
        { twitterUsername },
        { address }
    ]
   })
   .populate('rank')
   .populate({ path: "tags" })
   if(rank) {
    // @ts-ignore
    const tagsAccumulator = userExits ? Number(userExits.tags.reduce((acc, current) => acc + current.multiplier, 0)) : 0
    const multiplier = rank.multiplier + tagsAccumulator
    points = multiplier * Number(process.env.ARMY_DAILY_MULTIPLIER)
}
   if(userExits) {
    const now = new Date();
    const twentyFourHoursLater = new Date(userExits.pointsUpdatedAt.getTime() + 24 * 60 * 60 * 1000);
    await userModel.updateOne({ address }, {
        $set: {
            twitterHandle,
            twitterUsername,
            profilePhoto,
            ...( rank && {rank: rank?._id}),
            ...(now >= twentyFourHoursLater && {
                pointsUpdatedAt: Date.now()
            })
        },
        ...( now >= twentyFourHoursLater &&{$inc: {
            points 
        }})
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
        ...(rank && { rank }),
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

export const getCampaigns = async (req: Request, res: Response) => {
    const campaigns = await campaignModel.find().sort({ createdAt: -1 }).populate({
        path: "tweets",
        populate: {
            path: "userId"
        }
    })
    .populate({
        path: "users",
        populate: { 
            path: "userId",
            populate: {
                path: "rank"
            } 
        },
    })
    .populate({
        path: "users",
        populate: { 
            path: "tweets", 
         },
    });
    res.status(200).json({ 
        success: true,
        message: "campaigns fetched successfully",
        campaigns
    })
}

export const getTags = async (req: Request, res: Response) => {
    const tags = await tagModel.find({ is_campaign_tag: false })
    res.status(200).json({ 
        success: true,
        message: "tags fetched successfully",
        tags
    })
}

export const awardBonusPoints = async (req: Request, res: Response) => {
    const id = req.params.id
    const user = await userModel.findOneAndUpdate({
        _id: id,
        bonusPointsAwarded: false
    }, { 
        $inc: {
            points: 100
        },
        $set: {
            bonusPointsAwarded: true
        }
    })
    if(!user) {
        res.status(400).json({ success: false, message: 'User not found or has already been awarded bonus points' })
        return 
    }

    res.status(200).json({
        success: true,
        message: 'Bonus points awarded successfully',
    })
}

export const linkUserExtendedAddress = async (req: Request, res: Response) => {
    try {
        const { address } = req.body
    const id = req.params.id
     await userModel.updateOne({ _id:  id}, {
        $push: {
            addresses: address
        }
    })

    res.status(200).json({
        success: true,
        message: 'Extended address linked successfully',
    })
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const unLinkUserExtendedAddress = async (req: Request, res: Response ) => { 
    try {
        const { address } = req.body
    const id = req.params.id
     await userModel.updateOne({ _id:  id}, {
        $pull: {
            addresses: address
        }
    })

    res.status(200).json({
        success: true,
        message: 'Extended address unlinked successfully',
    })
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message })
    }
}