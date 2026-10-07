'use strict';

const http = require('node:http');
const assert = require('node:assert/strict');

const HOST = '127.0.0.1';
let server = null;
let port = null;

function listen(targetPort) {
  return new Promise((resolve, reject) => {
    const next = http.createServer((req, res) => {
      if (req.url !== '/health') {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });
    next.once('error', reject);
    next.listen({ host: HOST, port: targetPort }, () => {
      server = next;
      resolve(next.address().port);
    });
  });
}

function stop() {
  return new Promise((resolve, reject) => {
    if (!server) return resolve();
    const current = server;
    server = null;
    current.close((error) => error ? reject(error) : resolve());
  });
}

function requestHealth() {
  return new Promise((resolve, reject) => {
    const request = http.get({ hostname: HOST, port, path: '/health', timeout: 1500, agent: false }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ statusCode: response.statusCode, body }));
    });
    request.once('timeout', () => request.destroy(new Error('request timeout')));
    request.once('error', reject);
  });
}

async function main() {
  try {
    port = await listen(0);
    const healthy = await requestHealth();
    assert.equal(healthy.statusCode, 200);
    assert.deepEqual(JSON.parse(healthy.body), { status: 'ok' });
    console.log('PASS healthy: HTTP 200 on 127.0.0.1:<ephemeral>/health');

    await stop();
    let refused = false;
    try {
      await requestHealth();
    } catch (error) {
      refused = error && error.code === 'ECONNREFUSED';
      assert.equal(error.code, 'ECONNREFUSED');
    }
    assert.equal(refused, true, 'stopped service must refuse the connection');
    console.log('PASS stopped: connection refused (ECONNREFUSED)');

    const restartedPort = await listen(port);
    assert.equal(restartedPort, port);
    const recovered = await requestHealth();
    assert.equal(recovered.statusCode, 200);
    assert.deepEqual(JSON.parse(recovered.body), { status: 'ok' });
    console.log('PASS restarted: HTTP 200 recovery on same loopback port');
    console.log('RESULT 3/3 scenarios passed');
  } finally {
    await stop();
  }
}

main().catch((error) => {
  console.error(`FAIL ${error.code || error.name}: ${error.message}`);
  process.exitCode = 1;
});
