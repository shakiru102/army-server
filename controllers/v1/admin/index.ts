import { Request, Response } from "express";
import { accessLevelValidation, campaignTweetValidation, createCampaignValidation, endCampaignValidation, rankValidation, tagValidation, updateTagValidation } from "../../../utils/validations";
import rankModel from "../../../models/rankModel";
import userModel from "../../../models/userModel";
import campaignModel from "../../../models/campaignModel";
import tagModel from "../../../models/tagModel";
import tweetModel from "../../../models/tweetModel";
import campaignUserModel from "../../../models/campaignUserModel";

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

    const tagExists = await tagModel.findOne({ name: req.body.tag })
    if(tagExists) {
        res.status(400).json({
            success: false,
            message: "Tag already exists"
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


// CREATE USER AND TWEET
    const user = await userModel.findOne({
        $or: [
            { twitterUsername: "" },
            {twitterHandle: ""}
        ]
    })
    if(!user) {
        res.status(400).json({
            success: false,
            message: "User not in the army"
        })
        return
    }
    const isUser = await campaignUserModel.findOne({ campaignId: req.params.campaignId, userId: user._id })
    const tweet = await tweetModel.create({ userId: user._id, views: "", campaignId: req.params.campaignId, ...req.body })

    if(isUser) {
        await Promise.all([
            campaignUserModel.updateOne({ campaignId: req.params.campaignId, userId: user._id }, {
                $push: {
                    tweets: tweet._id
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
        tweets: [tweet]
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

    // UPDATE TWEET VIEWS IN DB
    try {
        await tweetModel.updateOne({ tweetId: req.params.tweetId }, { views: parseInt("") })
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
    const { error } = endCampaignValidation(req.body)
    if(error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        return
    }

    const campaign = await campaignModel.findOne({ _id: req.params.campaignId })
    if(!campaign) {
        res.status(404).json({ success: false, message: 'Campaign not found' })
        return 
    }
    const tag = await tagModel.create({
        is_campaign_tag: true,
        multiplier: campaign.winner_multiplier,
        name: campaign.tag
    })

    await Promise.all([
        userModel.updateMany({ 
            $or: req.body.first_position.map((addr: string) => ({ address: addr }))
        }, {
            $push: {
                tags: tag._id,
            },
            $inc: {
                points: campaign.first_place_point
            }
        }),
        userModel.updateMany({ 
            $or: req.body.second_position.map((addr: string) => ({ address: addr }))
         }, {
            $inc: {
                points: campaign.second_place_point
            }
        }),
        userModel.updateMany({
            $or: req.body.third_position.map((addr: string) => ({ address: addr }))
        }, {
            $inc: {
                points: campaign.third_place_point
            }
        }),
        campaignModel.updateOne({ _id: req.params.campaignId }, { is_campaign_active: false })
    ])
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