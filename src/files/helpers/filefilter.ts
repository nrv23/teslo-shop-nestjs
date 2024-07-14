import { Request } from "express";


export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {

    if(!file) return cb(new Error("File is empty"), false);

    const fileExt = file.mimetype.split('/')[1];
    const validExt = ['jpg','jpeg','png','gif'];

    if(!validExt.includes(fileExt)) return cb(new Error("Invalid file extension"),false);

    return cb(null,true)
}