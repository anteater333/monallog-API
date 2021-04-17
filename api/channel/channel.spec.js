const should = require('should');
const request = require('supertest');

// assume remote test server
const app = require('../../config').TEST_SERVER_ADDR

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

const badData = {
    badAttr: "BADDATA",
    channelName: "test_BADDATA"
}

describe('POST /channels', () => {
    describe('정상 데이터 POST 시', () => {
        it('상태 코드 201을 반환한다.', (done) => {
            request(app)
                .post('/channels')
                .set("Content-Type", "application/json")
                .send(testData)
                .expect(201, done);
        });
    });
    
    describe('비정상 데이터 POST 시', () => {
        it('상태 코드 400을 반환한다.', (done) => {
            request(app)
                .post('/channels')
                .set('Content-Type', 'application/json')
                .send(badData)
                .expect(400, done);
        });
    });
});

describe('GET /channels', () => {
    it('상태 코드 200을 반환한다. ', (done) => {
        request(app)
            .get('/channels')
            .expect(200, done);
    });

    it('Channel의 개수는 하나이다.', (done) => {
        request(app)
            .get('/channels')
            .end((err, res) => {
                if (err) throw err;
                should(res.body).be.an.instanceOf(Array).and.lengthOf(1);
                done();
            });
    });

    it('Channel API에 정의된 데이터를 얻는다.', (done) => {
        request(app)
            .get('/channels')
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
                done();
            });
    });
});

describe('GET /channels/:channelName', () => {
    describe('성공 시', () => {
        it('상태 코드 200을 반환한다.', (done) => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200, done);
        });

        it('channelName에 해당하는 자원을 얻는다.', (done) => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    should(res.body).have.properties('channelName', 'description', 'tags', 'favorited', 'dateCreated', 'channelOptions');
                    should(res.body.channelName).equal(testData.channelName);
                    done();
                });
        });
    });

    describe('실패 시', () => {
        it('존재하지 않는 channelName을 요청 시 404 코드를 반환한다.', (done) => {
            request(app)
                .get('/channels/' + badData.channelName)
                .expect(404, done);
        });
    });
})

describe('PUT /channels/:channelName', () => {
    describe('성공 시', () => {
        const newDesc = "test입니다."
        it('상태 코드 200를 반환한다.', (done) => {
            request(app)
                .put('/channels/' + testData.channelName)
                .set("Content-Type", "application/json")
                .send( {description: newDesc} )
                .expect(200, done);
        });

        it('자원의 요청한 부분만 변경이 반영되었다.', (done) => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    
                    should(res.body.channelName).be.equal(testData.channelName)
                    should(res.body.description).be.equal(newDesc)

                    done();
                });
        });
    });

    describe('실패 시', () => {
        it('비정상 데이터 PUT 시 상태 코드 400을 반환한다.', (done) => {
            request(app)
                .put('/channels/' + testData.channelName)
                .set('Content-Type', 'application/json')
                .send(badData)
                .expect(400, done);
        });

        it('존재하지 않는 데이터를 수정 시도 시 상태코드 404를 반환한다. ', (done) => {
            request(app)
                .put('/channels/' + badData.channelName)
                .set('Content-Type', 'application/json')
                .send(testData)
                .expect(404, done);
        });
    });
});

describe('DELETE /channels/:channelName', () => {
    describe('성공 시', () => {
        it('상태 코드 204를 반환한다.', (done) => {
            request(app)
                .delete('/channels/' + testData.channelName)
                .expect(204, done);
        });

        it('해당 채널이 삭제되어 요청 시 404 코드를 반환한다.', (done) => {
            request(app)
                .get('/channels/' + testData.channelName)
                .expect(404, done);
        });
    });

    describe('실패 시', () => {
        it('존재하지 않는 channelName을 요청 시 404 코드를 반환한다.', (done) => {
            request(app)
                .delete('/channels/' + badData.channelName)
                .expect(404, done);
        });
    });
});