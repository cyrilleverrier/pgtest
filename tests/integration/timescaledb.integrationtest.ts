
import pRetry from 'p-retry';
const { Pool } = require('pg')

const cns_correct = `postgres://postgres:password@localhost:5432/postgres?ssl=false`
const cns_wrong_password = `postgres://postgres:wrongpassword@localhost:5432/postgres?ssl=false`
const cns_ssl_true = `postgres://postgres:password@localhost:5432/postgres?ssl=true`
      
describe("Connect to timescaledb docker container", () => {
  test("with correct connection string", async (done) => {

    const connected = await ensureConnected();
    expect(connected).toBeTruthy();
    
    const version = await getPostgresVersion(cns_correct);
    expect(version).toEqual(expect.stringContaining('PostgreSQL'))

    done();
  });
});

describe("Connect to timescaledb docker container", () => {
  test("with wrong password", async (done) => {

    const connected = await ensureConnected();
    expect(connected).toBeTruthy();

    await expect(getPostgresVersion(cns_wrong_password)).rejects.toThrow(
      "password authentication failed"
    );

    done();
  });
});

describe("Connect to timescaledb docker container", () => {
  test("with SSL = true", async (done) => {

    const connected = await ensureConnected();
    expect(connected).toBeTruthy();

    await expect(getPostgresVersion(cns_ssl_true)).rejects.toThrow(
      "The server does not support SSL connections");

    done();
  });
});


async function ensureConnected(): Promise<boolean>{
  console.log("Try to connect to PostgreSQL...")

  
  var result = await pRetry(async () => {
      return await getPostgresVersion(cns_correct);
  }, {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 2000,
  });

  console.log(`Done. Result: ${result}`)
  return result.includes('PostgreSQL') ;
}

async function getPostgresVersion(cn: string): Promise<string> {
  console.log(`   Creating connection ${cn}`)      
  const pool = new Pool({connectionString: cn});
  try {
      console.log("   Try to get version...")
      // Retry to connect until the client can query the PostgreSQL version
      console.log(cn);
      const res = await pool.query('SELECT version();');
      const version = res.rows[0].version
      console.log(`Version: ${version}`);
      expect(version).toEqual(expect.stringContaining('PostgreSQL'));
      return version;
  }
  catch (e) {
      // Catch and throws exceptions
      console.log(`Exception in query: ${e}`);
      throw new Error(e);
  }
  finally {
    console.log(`   Closing connection ${cn}`)      
    pool.end();
  }
}
