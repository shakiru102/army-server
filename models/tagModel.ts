import { model, Schema } from 'mongoose'
import { TagInterface } from '../types'

const tagSchema = new Schema<TagInterface>({
    is_campaign_tag: { type: Boolean, default: false },
    name: { type: String, required: true, unique: true },
    multiplier: { type: Number, required: true },
}, { timestamps: true })

export default model<TagInterface>('tags', tagSchema)