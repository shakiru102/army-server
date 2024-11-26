import { Request, Response } from "express";
import { accessLevelValidation, campaignTweetValidation, createCampaignValidation, rankValidation, tagValidation, updateTagValidation } from "../../../utils/validations";
import rankModel from "../../../models/rankModel";
import userModel from "../../../models/userModel";
import campaignModel from "../../../models/campaignModel";
import tagModel from "../../../models/tagModel";
import tweetModel from "../../../models/tweetModel";
import campaignUserModel from "../../../models/campaignUserModel";
import { CampaignInterface, TweetInfoProps } from "../../../types";
import axios from "axios";
import { gettweetresponse } from "../../../utils/tweets";

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


export const createCampaign = async (req: Request, res: Response) => {
    const { error } = createCampaignValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }

    const isActive = await campaignModel.findOne({ is_campaign_active: true })
    if(isActive) { 
        res.status(400).json({
            success: false,
            message: "Can not create a campaign while one is active"
        })
        return
    }

    

    try {
        const campaign =  await campaignModel.create(req.body)
        res.status(201).json({
            success: true,
            message: "Campaign created successfully",
            campaign
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
export const addCampaignTweets = async (req: Request, res: Response) => {
// VALIDATE REQUEST PAYLOAD
    const { error } = campaignTweetValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }
//  CHECKING IF TWEET EXISTS
    const isExist = await tweetModel.findOne({ tweetId: req.body.tweetId })
    if(isExist) {
        res.status(400).json({
            success: false,
            message: "Tweet already exists"
        })
        return
    }
//  GET TWEETS INFORMATION FROM THIRD PARTY
    // const tweetInfo = await gettweetresponse(req.body.tweetId)
    // const info: TweetInfoProps = tweetInfo.data as any
    // if(!info.data.data.tweetResult.result) {
    //     res.status(400).json({
    //         success: false,
    //         message: "Tweet not found"
    //     })
    //     return
    // }

    
// CREATE USER AND TWEET
    const user = await userModel.findOne({ $or: [
        { twitterHandle: req.body.username },
        { twitterUsername: req.body.username },
    ] })
    
    if(!user) {
        res.status(400).json({
            success: false,
            message: "User not in the army"
        })
        return
    }
    // @ts-ignore
    const campaign: CampaignInterface = req.campaign
    const retweetedPoints = req.body.retweeted ? campaign.retweetPoint : 0
    const isUser = await campaignUserModel.findOne({ campaignId: req.params.campaignId, userId: user._id })
    const tweet = await tweetModel.create({ 
        userId: user._id,
        campaignId: req.params.campaignId, 
        points: campaign.likePoint + retweetedPoints,
        link: req.body.link,
        tweetId: req.body.tweetId,
        ...( req.body.retweeted && {retweeted: req.body.retweeted}),
        })

    if(isUser) {
        await Promise.all([
            campaignUserModel.updateOne({ campaignId: req.params.campaignId, userId: user._id }, {
                $push: {
                    tweets: tweet._id
                },
                $inc: {
                    campaignPoints: campaign.likePoint + retweetedPoints
                }
            }),
            campaignModel.updateOne({ _id: req.params.campaignId }, {
                $push: {
                    tweets: tweet._id
                }
            })
        ])
        
        res.status(201).json({
            success: true,
            message: "Tweet added to campaign successfully",
            tweet
        })
        return
    }
   const campaignUser = await campaignUserModel.create({
        userId: user._id,
        campaignId: req.params.campaignId,
        tweets: [tweet],
        campaignPoints: campaign.likePoint + retweetedPoints
    })
   await Promise.all([
        userModel.updateOne({ _id: user._id}, {
            $push: {
                campaigns: req.params.campaignId
            }
        }),
        campaignModel.updateOne({ _id: req.params.campaignId }, {
            $push: {
                users: campaignUser._id,
                tweets: tweet._id
            }
        })
    ])
   
    res.status(201).json({
        success: true,
        message: "User added to campaign successfully",
        tweet
    })
}
export const syncTweetViews = async (req: Request, res: Response) => {

    // GET TWEET VIEWS
    const tweetInfo = await gettweetresponse(req.params.tweetId)
    const info: TweetInfoProps = tweetInfo.data as any
    if(!info.data.data.tweetResult.result) {
        res.status(400).json({
            success: false,
            message: "Tweet not found"
        })
        return
    }
    // UPDATE TWEET VIEWS IN DB
    try {
        await tweetModel.updateOne({ tweetId: req.params.tweetId }, { views: Number(info.data.data.tweetResult.result.views.count) })
        res.status(200).json({
            success: true,
            message: "Tweet views updated successfully"
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}





// Super Admin Controllers
export const endCampaign = async (req: Request, res: Response) => {
    // const { error } = endCampaignValidation(req.body)
    // if(error) {
    //     res.status(400).json({
    //         success: false,
    //         message: error.details[0].message
    //     })
    //     return
    // }

    const campaign = await campaignModel.findOneAndUpdate(
        { _id: req.params.campaignId }, 
        { is_campaign_active: false }
    )
    if(!campaign) {
        res.status(404).json({ success: false, message: 'Campaign not found' })
        return 
    }
   res.status(200).json({
    success: true,
    message: "Campaign status updated successfully"
   })    
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
export const createTags = async (req: Request, res: Response) => {
    const { error } = tagValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }

    const tag = await tagModel.create({
        is_campaign_tag: false,
        multiplier: req.body.multiplier,
        name: req.body.name
    })

    res.status(201).json({
        success: true,
        message: "Tag created successfully",
        tag
    })
}

export const updateUserTag = async (req: Request, res: Response) => {
    const { error } = updateTagValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }

    try {
        await userModel.updateOne({ _id: req.body.userId }, { $push: { tags: req.body.tagId } })
        res.status(201).json({
            success: true,
            message: "Tag added to user successfully"
        })
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}