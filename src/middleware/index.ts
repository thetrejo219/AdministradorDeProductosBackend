import {Request,Response,NextFunction} from 'express'
import { validationResult } from 'express-validator'
export const handleInputErrors=(req:Request,res:Response,next:NextFunction)=>{
    let errores=validationResult(req)
    if(!errores.isEmpty()){
        res.status(400).json({errores:errores.array()})
        return
    }
    next()
}
