const should = require('should');
const request = require('supertest');

const app = require('../../app');
const ChannelModel = require('../../database/model').Channels;

setTimeout(() => {
    describe('GET /channels', () => {
        it('should return 200 status code', (done) => {
            request(app)
                .get('/channels')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    done();
                });
        });
    
        it('should return array', (done) => {
            request(app)
                .get('/channels')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    res.body.should.be.an.instanceof(Array);
                    // res.body.should.be.an.instanceof(Array).and.have.length(3);
                    // res.body.map((channel) => {
                    //     channel.should.have.properties('id', 'name');
                    //     channel.id.should.be.a.Number();
                    //     channel.name.should.be.a.String();
                    // });
                    done();
                });
        });
    });

    describe('POST /channels', () => {
        before((done) => {
            // clear channels collection
            ChannelModel.deleteMany({}, (err) => done(err));
        });

        const testData = {
            channelName: "test01",
            description: "test channel #01",
            tags: ["tag1", "tag2", "tag3"],
            channelOptions: {
                backgroundURL: "http://test.rsrc",
                playlist: [
                    {
                        title: "the song",
                        by: "the singer",
                        URL: "http://test.rsrc/song1"
                    },
                    {
                        title: "the song2",
                        by: "the singer2",
                        URL: "http://test.rsrc/song2"
                    }
                ]
            }
        };

        it('상태 코드 201을 반환한다. ', (done) => {
            request(app)
                .post('/channels')
                .set("Content-Type", "application/json")
                .send(testData)
                .expect(201)
                .end((err, res) => {
                    if (err) throw err;
                    done();
                });
        });
    });

    run();
}, 5000);
