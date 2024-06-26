/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  GetApi,
} from "../../src";
import { generateDBOSTestConfig, setUpDBOSTestDb } from "../helpers";
import request from "supertest";
import { HandlerContext } from "../../src/httpServer/handler";
import { KoaCors } from "../../src/httpServer/middleware";
import { DBOSConfig } from "../../src/dbos-executor";
import { TestingRuntime, createInternalTestRuntime } from "../../src/testing/testing_runtime";
import cors from "@koa/cors";
import { Context } from "koa";

describe("http-cors-tests", () => {
  let testRuntime: TestingRuntime;
  let config: DBOSConfig;

  beforeAll(async () => {
    config = generateDBOSTestConfig();
    await setUpDBOSTestDb(config);
  });

  beforeEach(async () => {
    testRuntime = await createInternalTestRuntime([TestEndpointsDefCORS, TestEndpointsRegCORS, TestEndpointsSpecCORS], config);
  });

  afterEach(async () => {
    await testRuntime.destroy();
  });

  // Check get with us as origin
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://us.com');

    expect(response.headers['access-control-allow-origin']).toBe('https://us.com');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://us.com');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://us.com');

    expect(response.headers['access-control-allow-origin']).toBe('https://us.com');
    expect(response.status).toBe(200);
  });

  // Check get with partner as origin
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://partner.com');

    expect(response.headers['access-control-allow-origin']).toBe('https://partner.com');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://partner.com');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://partner.com');

    expect(response.headers['access-control-allow-origin']).toBe('https://partner.com');
    expect(response.status).toBe(200);
  });

  // Check get with another origin
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://crimeware.com');

    expect(response.headers['access-control-allow-origin']).toBe('https://crimeware.com');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://crimeware.com');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins - not this one', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://crimeware.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.status).toBe(200); // IRL this response will not be shared by the browser to the caller; POSTs could be preflighted.
  });


  // Check get with us as origin AND credentials
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://us.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('https://us.com');
    expect(response.headers['access-control-allow-credentials']).toBe('true');

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://us.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    // IRL the browser will hate this result of '*' and refuse to share response w/ client

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://us.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('https://us.com');
    expect(response.headers['access-control-allow-credentials']).toBe('true');

    expect(response.status).toBe(200);
  });

  // Check get with partner as origin AND credentials
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://partner.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('https://partner.com');
    expect(response.headers['access-control-allow-credentials']).toBe('true');

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://partner.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    // IRL the browser will hate this result of '*' and refuse to share response w/ client

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://partner.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('https://partner.com');
    expect(response.headers['access-control-allow-credentials']).toBe('true');

    expect(response.status).toBe(200);
  });

  // Check get with another origin AND credentials
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellod') // Default CORS policy
      .set('Origin', 'https://crimewave.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('https://crimewave.com');
    expect(response.headers['access-control-allow-credentials']).toBe('true');

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellor') // Regular cors() defaults from Koa
      .set('Origin', 'https://crimewave.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
    // IRL the browser will hate this result of '*' and refuse to share response w/ client

    expect(response.status).toBe(200);
  });
  it('should allow requests without credentials from allowed origins - not this one', async () => {
    const response = await request(testRuntime.getHandlersCallback())
      .get('/hellos') // Custom whitelist cors() implementation
      .set('Origin', 'https://crimewave.com')
      .set('Cookie', 'sessionId=abc123');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();

    expect(response.status).toBe(200);
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestEndpointsDefCORS {
  // eslint-disable-next-line @typescript-eslint/require-await
  @GetApi("/hellod")
  static async hello(_ctx: HandlerContext) {
    return { message: "hello!" };
  }
}

@KoaCors(cors())
class TestEndpointsRegCORS {
  // eslint-disable-next-line @typescript-eslint/require-await
  @GetApi("/hellor")
  static async hello(_ctx: HandlerContext) {
    return { message: "hello!" };
  }
}

@KoaCors(cors({
  credentials: true,
  origin:
    (o: Context)=>{
      const whitelist = ['https://us.com','https://partner.com'];
      const origin = o.request.header.origin ?? '*';
      if (whitelist && whitelist.length > 0) {
        return (whitelist.includes(origin) ? origin : '');
      }
      return o.request.header.origin || '*';
    }
}))
class TestEndpointsSpecCORS {
  // eslint-disable-next-line @typescript-eslint/require-await
  @GetApi("/hellos")
  static async hello(_ctx: HandlerContext) {
    return { message: "hello!" };
  }
}
