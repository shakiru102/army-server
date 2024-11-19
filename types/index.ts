import Mongoose from "mongoose";

export interface UserInterface {
    address: string;
    twitterHandle: string;
    twitterUsername: string;
    balance: number;
    rank: Mongoose.Types.ObjectId;
    _id?: Mongoose.Types.ObjectId;
    leaderboardPoint?: number;
    profilePhoto?: string;
    points: number
    accessLevel: "user" | "admin" | "super admin";
    tags: Mongoose.Types.ObjectId[];
    campaigns: Mongoose.Types.ObjectId[];
}

export interface RankInterface {
    _id?: Mongoose.Types.ObjectId;
    name: string;
    multiplier: number;
    min_army: number;
    max_army: number;
}

export interface TagInterface {
    _id?: Mongoose.Types.ObjectId;
    name: string;
    multiplier: number;
    is_campaign_tag: boolean;
}

export interface CampaignInterface {
    _id?: Mongoose.Types.ObjectId;
    name: string;
    tag: string;
    description: string;
    winner_multiplier: number;
    first_place_point: number;
    second_place_point: number;
    third_place_point: number;
    is_campaign_active: boolean;
    users: Mongoose.Types.ObjectId[];
    tweets: Mongoose.Types.ObjectId[];
    
}

export interface CampaignTweetInterface {
    _id?: Mongoose.Types.ObjectId;
    tweetId: string;
    link: string;
    campaignId: Mongoose.Types.ObjectId;
    userId: Mongoose.Types.ObjectId;
    views: number;
}

export interface CampaignUserInterface {
    _id?: Mongoose.Types.ObjectId;
    userId: Mongoose.Types.ObjectId;
    campaignId: Mongoose.Types.ObjectId;
    tweets: Mongoose.Types.ObjectId[]
}