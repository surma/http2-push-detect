#!/usr/bin/env node

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const http2 = require('http2');
const url = require('url');

const requestUrl = url.parse(process.argv.pop());
// Security lol
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = http2.get(requestUrl);

let pushCount = 0;
let finished = 0;
function finish () {
  finished += 1;
  if (finished === (1 + pushCount)) {
    process.exit();
  }
}
request.on('response', response => {
  response.on('data', _ => {});
  response.on('end', finish);
});
request.on('push', pushRequest => {
  pushCount += 1;
  console.log('Receiving pushed resource: ' + pushRequest.url);
  pushRequest.cancel();
  finish();
});
