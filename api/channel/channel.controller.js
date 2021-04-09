const models = require('../../database').models;

exports.index = (req, res) => {     // GET /channels
    models.Channels.find()
    .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        return res.status(520).json({
            error : 'Something Broken',
            msg : err
        });
    });
};

exports.show = (req, res) => {      // GET /channels/:channelName
    models.Channels.find({channelName: req.params.channelName})
    .then(docs => {
        if (docs.length === 0) { // No such channel
            return res.status(404).json({error: 'No such channel'});
        }
        else {
            return res.json(docs[0]);
        }
    })
    .catch(err => {
        return res.status(520).json({
            error : 'Something Broken',
            msg : err
        });
    });
};

exports.destroy = (req, res) => {   // DELETE /channels/:channelName
    const name = req.params.channelName;
    if (!name) {
        return res.status(400).json({error: 'Incorrect name'});
    }

    models.Channels.deleteOne({channelName: name}, (err, result) => {
        if (err) {
            return res.status(520).json({
                error : 'Something Broken',
                msg : err
            });
        }
        return res.status(204).json();
    });
};

exports.create = (req, res) => {    // POST /channels
    const body = req.body
    const inputData = new models.Channels(body);

    inputData.save()
    .then(channel => {
        res.status(201).json(channel);
    })
    .catch(err => {
        return res.status(520).json({
            error : 'Something Broken',
            msg : err
        });
    });
};

/**
 * NOT IMPLEMENTED YET
 * @param {} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
    res.json();
};