
import multer from 'multer';
import DataUriParser from "datauri/parser.js";
import path from 'path';
const storage = multer.memoryStorage();
export const multerUploads = multer({ storage }).single('file');




export const getUri = (file) => {
    console.log(file)
    const dUri = new DataUriParser();
    const Uri = dUri.format(path.extname(file.originalname).toString(), file.buffer);
    return Uri
}

