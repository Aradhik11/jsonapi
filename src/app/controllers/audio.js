const Joi = require('joi');
const Audio = require('../models/audio');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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
            category: Joi.string().required(),
            artist: Joi.string().required(),
            description: Joi.string().allow('', null).optional(),
        });

        // check error
        const { error } = audioSchema.validate({
            title: req.body.title,
            category: req.body.category,
            artist: req.body.artist,
            description: req.body.description
        }, {
        abortEarly: false,
        })

        // return error from fileds
        if (error) return res.status(400).json(error.details[0].message);

        if (!req.file) {
            return res.status(400).json("Please upload an audio file");
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video", // Cloudinary treats audio as video resource type
            folder: `Lectures/${req.body.category}`,
            use_filename: true,
            unique_filename: true,
        });

        // Create new audio with Cloudinary data
        const newAudio = new Audio({
            title: req.body.title,
            category: req.body.category,
            artist: req.body.artist,
            description: req.body.description,
            audioname: req.file.filename,
            audiourl: result.secure_url,
            cloudinary_id: result.public_id
        });

        // save audio
        const audio = await newAudio.save();

        // Delete local temporary file
        fs.unlinkSync(req.file.path);

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
        const audio = await Audio.findById(audioId);
        if (!audio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        // Delete from Cloudinary
        if (audio.cloudinary_id) {
            await cloudinary.uploader.destroy(audio.cloudinary_id, { resource_type: "video" });
        }

        // Delete from MongoDB
        await Audio.deleteOne({ _id: audioId });
        
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    
}