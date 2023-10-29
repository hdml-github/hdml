/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { QueryDef, QueryBuf, FrameDef } from "@hdml/schema";

const uri = "/frames/query.html?hdml-frame=query";
const tenant = "common";
let accessToken: string;
let sessionToken: string;
let queryDef: QueryDef;
let queryBuf: QueryBuf;

describe("REST APIs", () => {
  it("GET /api/v0/tokens", async () => {
    const url =
      "http://localhost:8887/api/v0/tokens" +
      `?tenant=${tenant}&ttl=2592000&scope={"key": "value"}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        session: "",
      },
    });
    accessToken = await res.text();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(accessToken).toBeDefined();
    expect(accessToken).toBeTruthy();
  });

  it("GET /api/v0/sessions", async () => {
    const url =
      "http://localhost:8887/api/v0/sessions" +
      `?tenant=${tenant}&token=${accessToken}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        session: "",
      },
    });
    sessionToken = await res.text();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(sessionToken).toBeDefined();
    expect(sessionToken).toBeTruthy();
  });

  it("GET /api/v0/queries/definitions", async () => {
    const url =
      "http://localhost:8887/api/v0/queries/definititions?" +
      `tenant=${tenant}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        session: sessionToken,
      },
    });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(400);
  });

  it("GET /api/v0/queries/definitions?uri=:uri", async () => {
    const url =
      "http://localhost:8887/api/v0/queries/definititions?" +
      `tenant=${tenant}&uri=${uri}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        session: sessionToken,
      },
    });
    queryDef = <QueryDef>await res.json();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(queryDef).toBeDefined();
    expect(queryDef.frame?.name).toBe("query");
  });

  it("POST /api/v0/queries/fragments", async () => {
    (<FrameDef>queryDef.frame).name = "new_query";
    queryBuf = new QueryBuf(queryDef);
    const url =
      "http://localhost:8887/api/v0/queries/fragments?" +
      `tenant=${tenant}`;
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        "content-type": "application/octet-stream",
        session: sessionToken,
      },
      body: queryBuf.buffer,
    });
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(201);
  });
});
