/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { QueryDef, QueryBuf, QueryPathBuf } from "@hdml/schema";
import { tableFromIPC } from "apache-arrow";

const uri = "/frames/query.html?hdml-frame=query";
const tenant = "common";
let accessToken: string;
let sessionToken: string;
let queryDef: QueryDef;
let queryBuf: QueryBuf;
let queryUri: string;

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

  it.skip("GET /api/v0/hdm/uris?tenant=:tenant (404)", async () => {
    const url =
      `http://localhost:8887/api/v0/hdm/uris?tenant=` + `${tenant}`;
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
    expect(res.status).toBe(404);
  });

  it("GET /api/v0/hdm/def?tenant=:tenant&uri=:uri", async () => {
    const url =
      "http://localhost:8887/api/v0/hdm/def?" +
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

  it("GET /api/v0/hdm/htm?tenant=:tenant&uri=:uri", async () => {
    const url =
      "http://localhost:8887/api/v0/hdm/htm?" +
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
    const html = await res.text();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(html).toBeDefined();
    expect(typeof html).toBe("string");
  });

  it("GET /api/v0/hdm/sql?tenant=:tenant&uri=:uri", async () => {
    const url =
      "http://localhost:8887/api/v0/hdm/sql?" +
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
    const sql = await res.text();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(sql).toBeDefined();
    expect(typeof sql).toBe("string");
  });

  it("GET /api/v0/hdm/uris?tenant=:tenant", async () => {
    const url =
      `http://localhost:8887/api/v0/hdm/uris?tenant=` + `${tenant}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        session: sessionToken,
      },
    });
    const queryUris = <string[]>await res.json();
    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
    expect(queryUris).toBeDefined();
    expect(Array.isArray(queryUris)).toBeTruthy();
  });

  it("POST /api/v0/queries", async () => {
    queryDef.frame && (queryDef.frame.name = "new_query");
    queryBuf = new QueryBuf(queryDef);

    // ---------------------------------------------------------------
    let url =
      "http://localhost:8887/api/v0/queries?" + `tenant=${tenant}`;
    let res = await fetch(url, {
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
    let buf = await res.arrayBuffer();
    const path = new QueryPathBuf(new Uint8Array(buf));
    queryUri = path.uri;
    console.log(queryUri);

    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(201);

    // ---------------------------------------------------------------
    url =
      "http://localhost:8887/api/v0/queries?" +
      `tenant=${tenant}&uri=${queryUri}`;
    res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        "content-type": "application/octet-stream",
        session: sessionToken,
      },
    });
    buf = await res.arrayBuffer();
    const table = tableFromIPC(<Buffer>buf);
    console.log(table.toArray());

    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it.skip("GET /api/v0/queries", async () => {
    const url =
      "http://localhost:8887/api/v0/queries?" +
      `tenant=${tenant}&uri=${queryUri}`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      redirect: "follow",
      cache: "no-cache",
      headers: {
        "content-type": "application/octet-stream",
        session: sessionToken,
      },
    });
    const buf = await res.arrayBuffer();
    const table = tableFromIPC(<Buffer>buf);
    console.log(table.toArray());

    expect(res.ok).toBeTruthy();
    expect(res.status).toBe(200);
  });
});
