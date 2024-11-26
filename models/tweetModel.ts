import { model, Schema } from 'mongoose'
import { CampaignTweetInterface } from '../types'

const tweetSchema = new Schema<CampaignTweetInterface>({
    tweetId: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'campaigns', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    points: { type: Number, default: 0 },
    retweeted: { type: Boolean, default: false },
}, { timestamps: true })

export default model<CampaignTweetInterface>('tweets', tweetSchema)