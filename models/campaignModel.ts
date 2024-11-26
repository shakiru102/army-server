import { model, Schema } from 'mongoose'
import { CampaignInterface } from '../types'

const campaignSchema = new Schema<CampaignInterface>({
    name: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    description: { type: String },
    users: [{ type: Schema.Types.ObjectId, ref: 'campaignUsers' }],
    tweets: [{ type: Schema.Types.ObjectId, ref: 'tweets' }],
}, { timestamps: true })

export default model<CampaignInterface>('campaigns', campaignSchema)