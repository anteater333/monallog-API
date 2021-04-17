const models = require('../../database').models;
const logger = require('../../logger').logger;
const mongoose = require('mongoose');

/**
 * TBD : Service layer 분리
 * 
 * 1.
 * 코드를 express.js router에서 분리하십시오.
 * 
 * 2.
 * service 레이어에는 req와 res 객체를 전달하지 마십시오.
 * 
 * 3.
 * 상태 코드 또는 헤더와 같은 HTTP 전송 계층과 관련된 것들은 반환하지 마십시오.
 * 
 * 에러처리 코드중복도 처리하자.  
 */


/** */
exports.index = async (req, res) => {     // GET /channels
    try {
        // exec는 mongoose 3 버전까지 필수였음. 이젠 필수는 아님.
        const channels = await models.Channels.find().exec();
        return res.status(200).json(channels);
    }
    catch (err) {
        logger.error('Service Error : ', err)
        return res.status(520).json({
            error : 'Something Broken',
            msg : err
        })
    }
};

exports.show = async (req, res) => {      // GET /channels/:channelName
    try {
        const channel = await models.Channels.findOne({ 
            channelName: req.params.channelName
        }).exec();

        if (!channel) { // No such channel
            return res.status(404).json({error: 'No such channel'});
        }
        else {
            return res.json(channel);
        }
    }
    catch (err) {
        logger.error('Service Error : ', err)
        return res.status(520).json({
            error : 'Something Broken',
            msg : err
        });
    }
};

exports.destroy = async (req, res) => {   // DELETE /channels/:channelName
    const name = req.params.channelName;
    if (!name) {
        return res.status(400).json({error: 'Incorrect name'});
    }

    try {
        const deleted = await models.Channels.deleteOne({channelName: name});

        if (deleted.deletedCount == 0) {  // Not found
            return res.status(404).json();
        }
        else {
            return res.status(204).json();
        }
    } catch (err) {
        logger.error('Service Error : ', err)
        return res.status(520).json({
            error : 'Something Broken',
            msg: err
        })
    }
};

exports.create = async (req, res) => {    // POST /channels
    const body = req.body

    try {
        const inputData = new models.Channels(body);
        let savedChannel = await inputData.save()
        
        return res.status(201).json(savedChannel);
    } catch (err) {
        if (err instanceof mongoose.Error.StrictModeError) {
            return res.status(400).json();
        }
        logger.error('Service Error : ', err)
        return res.status(520).json({
            error : 'Something Broken',
            msg: err
        })
    }
};

exports.update = async (req, res) => {    // PUT /channels/:channelName
    try {
        const channel = await models.Channels.findOneAndUpdate(
            {channelName: req.params.channelName},
            {$set: req.body}
        )

        if (!channel) { // Not found
            return res.status(404).json({error : 'No such channel'});
        }
        else {  // 수정 전 data 반환
            return res.status(200).json(channel);
        }
    } catch (err) {
        if (err instanceof mongoose.Error.StrictModeError) {
            return res.status(400).json();
        }
        logger.error('Service Error : ', err)
        return res.status(520).json({
            error : 'Something Broken',
            msg: err
        })
    }
};