import { model, Schema } from 'mongoose'
import { CampaignUserInterface } from '../types'

const campaignUserSchema = new Schema<CampaignUserInterface>({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'campaigns', required: true },
    tweets: [{ type: Schema.Types.ObjectId, ref: 'tweets' }]
}, { timestamps: true })

export default model<CampaignUserInterface>('campaignUsers', campaignUserSchema)