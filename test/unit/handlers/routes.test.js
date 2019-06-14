'use strict'

const Test = require('ava')
const Mockgen = require('../../util/mockgen.js')
const KafkaUtil = require('../../../src/lib/kafka/util')
const Sinon = require('sinon')
const Initialise = require('../../../src/server').initialize
const getPort = require('get-port')

let payload = {
  'from': 'noresponsepayeefsp',
  'to': 'payerfsp',
  'id': 'aa398930-f210-4dcd-8af0-7c769cea1660',
  'content': {
    'headers': {
      'content-type': 'application/vnd.interoperability.transfers+json;version=1.0',
      'date': '2019-05-28T16:34:41.000Z',
      'fspiop-source': 'noresponsepayeefsp',
      'fspiop-destination': 'payerfsp'
    },
    'payload': 'data:application/vnd.interoperability.transfers+json;version=1.0;base64,ewogICJmdWxmaWxtZW50IjogIlVObEo5OGhaVFlfZHN3MGNBcXc0aV9VTjN2NHV0dDdDWkZCNHlmTGJWRkEiLAogICJjb21wbGV0ZWRUaW1lc3RhbXAiOiAiMjAxOS0wNS0yOVQyMzoxODozMi44NTZaIiwKICAidHJhbnNmZXJTdGF0ZSI6ICJDT01NSVRURUQiCn0'
  },
  'type': 'application/json',
  'metadata': {
    'event': {
      'id': '3920382d-f78c-4023-adf9-0d7a4a2a3a2f',
      'type': 'position',
      'action': 'commit',
      'createdAt': '2019-05-29T23:18:32.935Z',
      'state': {
        'status': 'success',
        'code': 0,
        'description': 'action successful'
      },
      'responseTo': '1a396c07-47ab-4d68-a7a0-7a1ea36f0012'
    },
    'trace': {
      'traceId': 'bbd7b2c7-3978-408e-ae2e-a13012c47739',
      'parentId': '4e3ce424-d611-417b-a7b3-44ba9bbc5840',
      'spanId': 'efeb5c22-689b-4d04-ac5a-2aa9cd0a7e87',
    }
  }
}

/**
 * summary: POST Event
 * description: The HTTP request POST /event is used to get the status of the server
 * parameters: type, currency, accept, content-type, date
 * produces: application/json
 * responses: 200, 400, 401, 403, 404, 405, 406, 501, 503
 */
Test.serial('test Event throws and error', async function (t) {
  let sandbox = Sinon.createSandbox()
  const server = await Initialise(await getPort())
  const requests = new Promise((resolve, reject) => {
    Mockgen().requests({
      path: '/event',
      operation: 'post'
    }, function (error, mock) {
      return error ? reject(error) : resolve(mock)
    })
  })
  const mock = await requests
  t.pass(mock)
  t.pass(mock.request)
  //Get the resolved path from mock request
  //Mock request Path templates({}) are resolved using path parameters
  const options = {
    method: 'post',
    url: '/event'
  }
  mock.request = {
    body: payload
  }
  if (mock.request.body) {
    //Send the request body
    options.payload = mock.request.body
  } else if (mock.request.formData) {
    //Send the request form data
    options.payload = mock.request.formData
    //Set the Content-Type as application/x-www-form-urlencoded
    options.headers = options.headers || {}
  }
  // If headers are present, set the headers.
  if (mock.request.headers && mock.request.headers.length > 0) {
    options.headers = mock.request.headers
  }
  sandbox.stub(KafkaUtil, 'produceGeneralMessage').throws(new Error('Error'))
  const response = await server.inject(options)
  await server.stop()
  t.is(response.statusCode, 400, 'Bad request error thrown')
  sandbox.restore()
})

Test.serial('test Event processes correctly', async function (t) {
  let sandbox = Sinon.createSandbox()
  const server = await Initialise(await getPort())
  const requests = new Promise((resolve, reject) => {
    Mockgen().requests({
      path: '/event',
      operation: 'post'
    }, function (error, mock) {
      return error ? reject(error) : resolve(mock)
    })
  })
  const mock = await requests
  t.pass(mock)
  t.pass(mock.request)
  //Get the resolved path from mock request
  //Mock request Path templates({}) are resolved using path parameters
  const options = {
    method: 'post',
    url: '/event'
  }
  mock.request = {
    body: payload
  }
  if (mock.request.body) {
    //Send the request body
    options.payload = mock.request.body
  } else if (mock.request.formData) {
    //Send the request form data
    options.payload = mock.request.formData
    //Set the Content-Type as application/x-www-form-urlencoded
    options.headers = options.headers || {}
  }
  // If headers are present, set the headers.
  if (mock.request.headers && mock.request.headers.length > 0) {
    options.headers = mock.request.headers
  }
  sandbox.stub(KafkaUtil, 'produceGeneralMessage').returns(Promise.resolve(true))
  const response = await server.inject(options)
  await server.stop()
  t.is(response.statusCode, 200, 'Success')
  sandbox.restore()
})