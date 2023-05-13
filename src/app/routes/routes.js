'use strict';

// middleware
const upload = require('../middlewares/upload');
const isAudioFile = require('../middlewares/isAudioFile');
const remove = require('../middlewares/delete');



module.exports =  (app) => {
    
    // get audio controller
    let audioController = require('../controllers/audio');

    /**
    *
    * HOME ROUTES
    * 
    */
    app.route('/')
        .get(audioController.homePage);


    /**
    *
    * AUDIO ROUTES
    * 
    */
    app.route('/create')
        .post(upload.single('file'), isAudioFile,  audioController.createAudio);

    app.route('/delete-one/:audioId')
        .post(remove, audioController.deleteAudio);

    app.route('/read-all')
        .get(audioController.readAllAudio);

    app.route('/read-one/:audioId')
        .get(audioController.readOneAudio);

    // app.route('/update-one/:audioId')
    //     .patch(audioController.updateOneAudio);

}