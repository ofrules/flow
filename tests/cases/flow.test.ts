import express, { Express } from "express";
import request from "supertest";
import { expect } from "chai";

import { Flow } from "../mocks/flow";

import { flowMiddleware } from "../../src";

describe("Middleware not used", () => {
  let app: Express;
  before(() => {
    app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/test", (req, res) => {
      try {
        const data = Flow.get();

        return res.send(data);
      } catch {
        return res.sendStatus(500);
      }
    });
  });

  it("Try to get data", async () => {
    const response = await request(app).get("/test");

    expect(response.statusCode).to.eq(500);
  });
});

describe("Middleware used", () => {
  let app: Express;
  before(() => {
    app = express();
    app.use(flowMiddleware(Flow));
    app.get("/test", (req, res) => {
      try {
        const data = Flow.get();

        return res.send(data);
      } catch {
        return res.sendStatus(500);
      }
    });
  });

  it("Try to get data", async () => {
    const response = await request(app).get("/test");

    expect(response.statusCode).to.eq(200);
    expect(response.body.request.url).to.eq("/test");
  });
});
