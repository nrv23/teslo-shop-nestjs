import { v4 as uuid } from 'uuid';

export const fileRename = (req: Express.Request, file: Express.Multer.File, cb: Function) => {

    if(!file) return cb(new Error("File is empty"), false);

    const fileExt = file.mimetype.split("/")[1];
    const fileName = `${uuid()}.${fileExt}`;

    return cb(null,fileName);
}