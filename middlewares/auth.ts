import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jsonwebtoken";


export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const isExist = req.headers['authorization']
    if(!isExist) {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    const accessToken = isExist.replace("Bearer ", "")
    const data = verifyToken(accessToken)
    if(!data) {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    // @ts-ignore
    req.user = data as any
    next()
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const isExist = req.headers['authorization']
    if(!isExist) {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    const accessToken = isExist.replace("Bearer ", "")
    const data =  verifyToken(accessToken)
    if(!data) {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    
    // @ts-ignore
    if(data?.accessLevel === "admin" ) {
        // @ts-ignore
        req.user = data as any
        next()
        return
       
    } 
    // @ts-ignore
    else if (data?.accessLevel === "super admin") {
        // @ts-ignore
        req.user = data as any
        next()
        return
    } else {
        res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return 
    }
}

export const superAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    const isExist = req.headers['authorization']
    if(!isExist) {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    const accessToken = isExist.replace("Bearer ", "")
    const data = verifyToken(accessToken)
    if(!data) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return 
    }
    // @ts-ignore
    if(data?.accessLevel!== "super admin") {
         res.status(401).json({
            success: false,
            message: "Unauthorized access"
        })
        return
    }
    // @ts-ignore
    req.user = data as any
    next()
}