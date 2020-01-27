# pgtest

`jest` detects open handles even after ending the pool with `pool.end()`.

It only happens when the PostgreSQL server is not configured to support SSL and the connection string has `ssl=true`

# How to reproduce

```bash
yarn install
yarn integrationtest
```

or: 

```bash
yarn install
yarn integrationtest -t "SSL"
```

Note that handlers are correctly closed in the following test scenarii:
 - `yarn integrationtest -t "Version"`
 - `yarn integrationtest -t "wrong password"`


Output:
```bash
$ jest --config jest.integrationtests.config.js -t SSL
Determining test suites to run...
Setup Integration tests
    integration_tests docker container is running
    integration_tests docker container already started
 PASS  tests/integration/timescaledb.integrationtest.ts
  Connect to timescaledb docker container
    ✓ with SSL = true (72ms)
    ○ skipped with correct connection string
    ○ skipped with wrong password

  console.log tests/integration/timescaledb.integrationtest.ts:51
    Try to connect to PostgreSQL...

  console.log tests/integration/timescaledb.integrationtest.ts:68
       Creating connection postgres://postgres:password@localhost:5432/postgres?ssl=false

  console.log tests/integration/timescaledb.integrationtest.ts:71
       Try to get version...

  console.log tests/integration/timescaledb.integrationtest.ts:73
    postgres://postgres:password@localhost:5432/postgres?ssl=false

  console.log tests/integration/timescaledb.integrationtest.ts:76
    Version: PostgreSQL 9.6.13 on x86_64-pc-linux-musl, compiled by gcc (Alpine 8.3.0) 8.3.0, 64-bit

  console.log tests/integration/timescaledb.integrationtest.ts:86
       Closing connection postgres://postgres:password@localhost:5432/postgres?ssl=false

  console.log tests/integration/timescaledb.integrationtest.ts:63
    Done. Result: PostgreSQL 9.6.13 on x86_64-pc-linux-musl, compiled by gcc (Alpine 8.3.0) 8.3.0, 64-bit

  console.log tests/integration/timescaledb.integrationtest.ts:68
       Creating connection postgres://postgres:password@localhost:5432/postgres?ssl=true

  console.log tests/integration/timescaledb.integrationtest.ts:71
       Try to get version...

  console.log tests/integration/timescaledb.integrationtest.ts:73
    postgres://postgres:password@localhost:5432/postgres?ssl=true

  console.log tests/integration/timescaledb.integrationtest.ts:82
    Exception in query: Error: The server does not support SSL connections

  console.log tests/integration/timescaledb.integrationtest.ts:86
       Closing connection postgres://postgres:password@localhost:5432/postgres?ssl=true

Test Suites: 1 passed, 1 total
Tests:       2 skipped, 1 passed, 3 total
Snapshots:   0 total
Time:        0.747s, estimated 3s
Ran all test suites with tests matching "SSL".

Teardown Integration tests
done
Jest did not exit one second after the test run has completed.

This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```