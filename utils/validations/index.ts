import Joi from "joi";
import { CampaignInterface, CampaignTweetInterface, RankInterface, TagInterface, UserInterface } from "../../types";

const signinSchema = Joi.object<UserInterface>({
    address: Joi.string().required(),
    twitterHandle: Joi.string().required(),
    twitterUsername: Joi.string().required(),
    balance: Joi.number(),
    profilePhoto: Joi.string()
})

export const signinValidation = (user: UserInterface): Joi.ValidationResult => {
    return signinSchema.validate(user);
}

const rankSchema = Joi.object<RankInterface>({
    max_army: Joi.number().required(),
    min_army: Joi.number().required(),
    name: Joi.string().required(),
    multiplier: Joi.number().required()
})

export const rankValidation = (rank: RankInterface): Joi.ValidationResult => {
    return rankSchema.validate(rank);
}

const accessLevelSchema = Joi.object({
    accessLevel: Joi.string().valid("user", "admin", "super admin").required(),
    userId: Joi.string().required(),
})

export const accessLevelValidation = (accessLevel: { accessLevel: string, userId: string }): Joi.ValidationResult => {
    return accessLevelSchema.validate(accessLevel);
}

const createCampaignSchema = Joi.object<CampaignInterface>({
    description: Joi.string(),
    name: Joi.string().required(),
    tag: Joi.string(),
    likePoint: Joi.number().required().min(0),
    retweetPoint: Joi.number().required().min(0)
})

export const createCampaignValidation = (campaign: CampaignInterface): Joi.ValidationResult => {
    return createCampaignSchema.validate(campaign);
}

const campaignTweetSchema = Joi.object<CampaignTweetInterface>({
    link: Joi.string().required(),
    tweetId: Joi.string().required(),
    username: Joi.string().required(),
    retweeted: Joi.boolean().required()
})

export const campaignTweetValidation = (campaignTweet: CampaignTweetInterface): Joi.ValidationResult => {
    return campaignTweetSchema.validate(campaignTweet);
}

// const endCampaignSchema = Joi.object<{
//     first_position: string[],
//     second_position: string[],
//     third_position: string[],
// }>({
//     first_position: Joi.array().items(Joi.string()).required(),
//     second_position: Joi.array().items(Joi.string()).required(),
//     third_position: Joi.array().items(Joi.string()).required(),
// })

// export const endCampaignValidation = (endCampaign: { first_position: string[], second_position: string[], third_position: string[] }): Joi.ValidationResult => {
//     return endCampaignSchema.validate(endCampaign);
// }

const tagSchema = Joi.object<TagInterface>({
    multiplier: Joi.number().required(),
    name: Joi.string().required(),
})

export const tagValidation = (tag: TagInterface): Joi.ValidationResult => {
    return tagSchema.validate(tag);
}

const updateTagSchema = Joi.object<{
    userId: string;
    tagId: string;
}>({
    userId: Joi.string().required(),
    tagId: Joi.string().required(),
})

export const updateTagValidation = (updateTag: { userId: string, tagId: string }): Joi.ValidationResult => {
    return updateTagSchema.validate(updateTag);
}
