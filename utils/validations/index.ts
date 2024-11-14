import Joi from "joi";
import { RankInterface, UserInterface } from "../../types";

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