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
    it('상태 코드 201을 반환한다.', (done) => {
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

describe('GET /channels', () => {
    it('상태 코드 200을 반환한다. ', (done) => {
        request(app)
            .get('/channels')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                done();
            });
    });

    it('Channel 스키마에 부합한 데이터를 얻는다.', (done) => {
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

                done();
            });
    });
});

describe('GET /channels/:channelName', () => {
    it('channelName에 해당하는 자원을 얻어 상태 코드 200을 반환한다.', (done) => {
        request(app)
            .get('/channels/' + testData.channelName)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                res.body.should.have.properties('channelName', 'description', 'tags', 'favorited', 'dateCreated', 'channelOptions');
                done();
            });
    });
})

describe('DELETE /channels/:channelName', () => {
    it('channelName에 해당하는 자원이 삭제되어 상태 코드 204를 반환한다.', (done) => {
        request(app)
            .delete('/channels/' + testData.channelName)
            .expect(204)
            .end((err, res) => {
                if (err) throw err;
                done();
            });
    });
});