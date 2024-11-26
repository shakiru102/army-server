import { model, Schema } from "mongoose";
import { UserInterface } from "../types";

const userSchema = new Schema<UserInterface>({
    address: { type: String, required: true },
    twitterHandle: { type: String, required: true },
    twitterUsername: { type: String, required: true },
    points: { type: Number, default: 0 },
    rank: {type: Schema.Types.ObjectId, ref: "ranks"},
    profilePhoto: { type: String },
    accessLevel: { type: String, default: "user" },
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
    campaigns: [{type: Schema.Types.ObjectId, ref: "campaigns"}],
    pointsUpdatedAt: { type: Date, default: Date.now, required: true}
}, {
    timestamps: true
})

export default model<UserInterface>("users", userSchema)