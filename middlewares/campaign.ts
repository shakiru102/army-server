import { NextFunction, Request, Response } from "express";
import campaignModel from "../models/campaignModel";

export const isCampaignInActive = async (req: Request, res: Response, next: NextFunction) => {
    const isActive = await campaignModel.findOne({ is_campaign_active: false, _id: req.params.campaignId })
    if(isActive) { 
        res.status(400).json({
            success: false,
            message: "Can not perform this action while a campaign is inactive"
        })
        return
    }
    next();
}