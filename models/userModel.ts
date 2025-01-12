import { model, Schema } from "mongoose";
import { UserInterface } from "../types";

const userSchema = new Schema<UserInterface>({
    address: { type: String, required: true, unique: true },
    twitterHandle: { type: String, required: true, unique: true },
    twitterUsername: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    rank: {type: Schema.Types.ObjectId, ref: "ranks"},
    profilePhoto: { type: String },
    accessLevel: { type: String, default: "user" },
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
    campaigns: [{type: Schema.Types.ObjectId, ref: "campaigns"}],
    pointsUpdatedAt: { type: Date, default: Date.now, required: true},
    bonusPointsAwarded: { type: Boolean, default: false },
    addresses: {
        type: [{ type: Schema.Types.Mixed  }],
        validate: {
            validator: function (array) {
              return Array.isArray(array) && array.every(item => typeof item === 'object' && !Array.isArray(item));
            },
            message: 'addresses must be an array of objects with dynamic keys.',
          },
    }
}, {
    timestamps: true
})

export default model<UserInterface>("users", userSchema)