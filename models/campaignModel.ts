import { model, Schema } from 'mongoose'
import { CampaignInterface } from '../types'

const campaignSchema = new Schema<CampaignInterface>({
    name: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    description: { type: String },
    winner_multiplier: { type: Number, required: true },
    first_place_point: { type: Number, required: true },
    second_place_point: { type: Number, required: true },
    third_place_point: { type: Number, required: true },
    is_campaign_active: { type: Boolean, default: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'campaignUsers' }],
    tweets: [{ type: Schema.Types.ObjectId, ref: 'tweets' }]
}, { timestamps: true })

export default model<CampaignInterface>('campaigns', campaignSchema)