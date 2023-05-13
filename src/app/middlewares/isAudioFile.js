const console = require('console');
const fs = require('fs')
const audioFileExtensions = ['.mp3', '.wav', '.ogg'];

async function isAudioFile (req, res, next) {
    if (!req.file === true) await res.status(400).json('choose a file!');
    const fileExtension = '.' + req.file.originalname.split('.').pop();
    if (audioFileExtensions.includes(fileExtension) === true) {
        next();
    } else {
        fs.unlink(req.file.path, (err) => {
            res.status(415).json('Unsupported Media Type!');
        });
    }
}

module.exports = isAudioFile;