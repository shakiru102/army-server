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
    tags: string;

}

export interface RankInterface {
    _id?: Mongoose.Types.ObjectId;
    name: string;
    multiplier: number;
    min_army: number;
    max_army: number;
}