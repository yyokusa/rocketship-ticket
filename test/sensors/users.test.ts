import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

const roomA = "Room A";
const measurementTemperature = "Temperature";
const datetime = "2022-08-23T23:05:12Z";
const value = 22.8;

const sensorData = {
    Value: 22.8,
    Datetime: "2022-08-23T23:05:12Z",
    Room: "Room C",
    Measurement: "Temperature"
};

const sensorDataBulk = [
    {
        Value: 22.8,
        Datetime: "2022-08-23T22:06:12Z",
        Room: "Room C",
        Measurement: "Temperature"
    },
    {
        Value: 18.5,
        Datetime: "2022-08-23T14:11:25Z",
        Room: "Room A",
        Measurement: "Humidity"
    },
    {
        Value: 20.3,
        Datetime: "2022-08-24T09:36:40Z",
        Room: "Room B",
        Measurement: "Temperature"
    },
    {
        Value: 17.9,
        Datetime: "2022-08-25T20:47:02Z",
        Room: "Room B",
        Measurement: "Temperature"
    },
    {
        Value: 21.6,
        Datetime: "2022-08-26T16:33:55Z",
        Room: "Room C",
        Measurement: "Humidity"
    },
    {
        Value: 19.4,
        Datetime: "2022-08-26T19:25:30Z",
        Room: "Room A",
        Measurement: "Humidity"
    },
    {
        Value: 23.1,
        Datetime: "2022-08-27T19:58:48Z",
        Room: "Room C",
        Measurement: "Temperature"
    },
    {
        Value: 16.8,
        Datetime: "2022-08-27T23:49:15Z",
        Room: "Room A",
        Measurement: "Temperature"
    },
    {
        Value: 18.7,
        Datetime: "2022-08-28T18:29:30Z",
        Room: "Room B",
        Measurement: "Humidity"
    },
    {
        Value: 20.9,
        Datetime: "2022-08-29T11:19:00Z",
        Room: "Room C",
        Measurement: "Humidity"
    }
];

describe('sensors endpoints', function () {
    let request: supertest.SuperAgentTest;
    before(function () {
        request = supertest.agent(app);
    });

    after(function (done: any) {
        // shut down the Express.js server, close our MongoDB connection, then
        // tell Mocha we're done:
        app.close(() => {
            mongoose.connection.close()
            .then(() => {done();});
        });
    });

    it('should allow a POST to /sensors', async function () {
        const res = await request.post('/sensors').send(sensorData);
    
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.a('string');
    });
    
    it('should allow a POST to /sensors/bulk', async function () {
        const res = await request.post('/sensors/bulk').send(sensorDataBulk);
    
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.be.equal('success');
    });

    it('should allow a GET from /sensors with room filter', async function () {
        const res = await request
            .get(`/sensors?room=${roomA}`)
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('_id');
    });
});

