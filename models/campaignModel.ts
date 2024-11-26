import { model, Schema } from 'mongoose'
import { CampaignInterface } from '../types'

const campaignSchema = new Schema<CampaignInterface>({
    name: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    description: { type: String },
    users: [{ type: Schema.Types.ObjectId, ref: 'campaignUsers' }],
    tweets: [{ type: Schema.Types.ObjectId, ref: 'tweets' }],
    is_campaign_active: { type: Boolean, default: true },
    likePoint: { type: Number, default: 0 },
    retweetPoint: { type: Number, default: 0 }  // points earned in the campaign by the users who participate in it

}, { timestamps: true })

export default model<CampaignInterface>('campaigns', campaignSchema)