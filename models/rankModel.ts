import { model, Schema } from "mongoose";
import { RankInterface } from "../types";

const rankSchema = new Schema<RankInterface>({
    multiplier: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    min_army: { type: Number, required: true, unique: true },
    max_army: { type: Number, required: true, unique: true },
}, { timestamps: true })

export default model<RankInterface>("ranks", rankSchema)