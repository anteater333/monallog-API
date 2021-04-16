const should = require('should');
const request = require('supertest');

// assume remote test server
const app = require('../test.spec').testApp

const testData = {
    channelName: "test01",
    description: "test channel #02",
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

describe('POST /channels', () => {
    it('상태 코드 201을 반환한다.', () => {
        request(app)
            .post('/channels')
            .set("Content-Type", "application/json")
            .send(testData)
            .expect(201)
            .end((err, res) => {
                if (err) throw err;
            });
    });
});

describe('GET /channels', () => {
    it('상태 코드 200을 반환한다. ', () => {
        request(app)
            .get('/channels')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
            });
    });

    it('Channel 스키마에 부합한 데이터를 얻는다.', () => {
        request(app)
            .get('/channels')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                res.body.should.be.an.instanceof(Array);

                res.body.map((channel) => {
                    channel.should.have.properties('channelName', 'description', 'tags', 'favorited', 'dateCreated', 'channelOptions');
                    channel.channelName.should.be.a.String();
                    channel.description.should.be.a.String();
                    channel.tags.should.be.an.Array();
                    channel.favorited.should.be.an.Array();
                    channel.dateCreated.should.be.a.String();
                    channel.channelOptions.should.be.an.Object().and.have.properties('playlist', 'backgroundURL');
                });
            });
    });
});

describe('GET /channels/:channelName', () => {
    describe('성공 시', () => {
        it('상태 코드 200을 반환한다.', () => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                });
        });

        it('channelName에 해당하는 자원을 얻는다.', () => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    should(res.body).have.properties('channelName', 'description', 'tags', 'favorited', 'dateCreated', 'channelOptions');
                    should(res.body.channelName).equal(testData.channelName);
                });
        });
    });

    describe('실패 시', () => {
        it('존재하지 않는 channelName을 요청 시 404 코드를 반환한다.', () => {
            request(app)
                .get('/channels/' + 'TESTCHANNELDOESNOTEXIST')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                });
        });
    });
})

describe('PUT /channels/:channelName', () => {
    describe('성공 시', () => {
        const newDesc = "test입니다."
        it('상태 코드 200를 반환한다.', () => {
            request(app)
                .put('/channels/' + testData.channelName)
                .expect(200)
                .set("Content-Type", "application/json")
                .send( {description: newDesc} )
                .end((err, res) => {
                    if (err) throw err;
                });
        });

        it('자원의 요청한 부분만 변경이 반영되었다.', () => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    
                    should(res.body.channelName).be.equal(testData.channelName)
                    should(res.body.description).be.equal(newDesc)
                });
        });
    })
});

describe('DELETE /channels/:channelName', () => {
    describe('성공 시', () => {
        it('상태 코드 204를 반환한다.', () => {
            request(app)
                .delete('/channels/' + testData.channelName)
                .expect(204)
                .end((err, res) => {
                    if (err) throw err;
                });
        });

        it('해당 채널이 삭제되어 요청 시 404 코드를 반환한다.', () => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                });
        });
    });

    describe('실패 시', () => {
        it('존재하지 않는 channelName을 요청 시 404 코드를 반환한다.', () => {
            request(app)
                .delete('/channels/' + 'TESTCHANNELDOESNOTEXIST')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                });
        });
    });
});