const fs = require('fs');
const path = require('path');
const Audio = require('../models/audio');

async function remove (req, res, next) {
    const audioId  = req.params.audioId;
    const audio = await Audio.findOne({ _id: audioId });

    if (!(audioId === audio._id) === true) 
    fs.unlink(path.join(__dirname, '../uploads/' + audio.audioname), (err) => {
        if (err) {
            res.status(500).json('Unable to delete file form server!');
        } else {
            next();
        }
    }) 
}

module.exports = remove;

