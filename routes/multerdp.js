const multer=require("multer");
const {v4: uuidv4} = require("uuid");
const path = require("path");
const storage= multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/profile_picture')//destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4();//generatingh a unique file name uuid
        cb(null, uniqueFilename+path.extname(file.originalname));//use the unique filr name for uplading the file
    }
});``
const changedp = multer({ storage: storage });
module.exports = changedp;
