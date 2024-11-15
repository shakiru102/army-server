import jwt from "jsonwebtoken"
import { Types } from "mongoose"
declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: Types.ObjectId; 
        address: string; 
        accessLevel: string
    }
}

export const signToken = (data: {_id: Types.ObjectId; address: string; accessLevel: string}) => 
    jwt.sign(data, process.env.JSONWEBTOKEN_MESSAGE as string, {
        expiresIn: process.env.JSONWEBTOKEN_EXPIRATION_TIME,
        issuer: process.env.JSONWEBTOKEN_ISSUER,
    })

export const verifyToken = (token: string) => jwt.verify(token, process.env.JSONWEBTOKEN_MESSAGE as string)