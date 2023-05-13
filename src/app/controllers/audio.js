const Joi = require('joi');
const Audio = require('../models/audio');
const upload = require('../middlewares/upload');

exports.homePage = async (req, res) => {   

    try {

        const audios = await Audio.find();
         res.render("home", {
            audios: audios
        });

    } catch (err) {
        
        console.log(err);
        res.status(500).json(err);

    }

}


// CREATE AUDIO
exports.createAudio = async (req, res) => {

    try {

        const audioSchema = Joi.object({
            title: Joi.string().required(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
        });

        // check error
        const { error } = audioSchema.validate({
            title: req.body.title,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        }, {
        abortEarly: false,
        })

        // return error from fileds
        if (error) return res.status(400).json(error.details[0].message);

        // file url
        const  audioUrl  = `http://${req.headers.host}/` +  req.file.filename;


        //create new audio
        const newAudio = new Audio({
            title: req.body.title,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            audioname: req.file.filename,
            audiourl: audioUrl
        });

        
        //save audio and respond
        const audio = await newAudio.save();
        res.redirect("/");


    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }

}

// READ ALL AUDIO
exports.readAllAudio = async (req, res) => {

    try {
        const audio = await Audio.find();
        res.status(200).json(audio);
        console.log(audio);
    } catch (err) {
        res.status(500).json(err);
    }

}

// READ ONE AUDIO
exports.readOneAudio = async (req, res) => {

    const audioId  = req.params.audioId;

    try {
        const audio = await Audio.findOne({ _id: audioId });
        res.status(200).json(audio);
    } catch (err) {
        res.status(500).json(err);
    }

}

/**
*
*
PENDING NOT IMPORTANT
*
*
*/

// UPDATE ONE AUDIO
// exports.updateOneAudio = async (req, res) => {

//     try {
//         const audioSchema = Joi.object({
//             title: Joi.string().required(),
//             firstname: Joi.string().required(),
//             lastname: Joi.string().required(),
//         });
    
//         // check error
//         const { error } = userSchema.validate(req.body, {
//         abortEarly: false,
//         })
    
//         // return error from fileds
//         if (error) return res.status(400).json(error.details[0].message);
    
    
//         // audio new name
//         const  audioUrl  = `http://${req.headers.host}/` +  req.file.filename;
    
//         const updatedAudio = {
//             title: req.body.tile,
//             firstname: req.body.firstname,
//             lastname: req.body.lastname,
//             audiourl: audioUrl
//         }
    
//         // const audio = await Audio.updateOne(updatedAudio);
//         const audio = await Audio(
//             { _id: req.params.audioId },
//             { $set: { fieldToUpdate: updatedAudio } },
//             { new: true }
//         )
        
//         res.status(200).json('audio updated sucessfully');

//     } catch (err) {
//         res.status(500).json(err);
//         console.log(err);
//     }
    
// }

//DELETE ONE AUDIO
exports.deleteAudio = async (req, res) => {

    const audioId  = req.params.audioId;

    try {
        const audio = await Audio.deleteOne({ _id: audioId });
            res.redirect("/");
    } catch (err) {
            res.status(500).json(err);
    }
    
}