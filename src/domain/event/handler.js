/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation

 - Rajiv Mothilal <rajiv.mothilal@modusbox.com>

 --------------
 ******/

'use strict'

const kafkaUtil = require('../../lib/kafka/util')
const Enums = require('../../lib/enum')
const Boom = require('@hapi/boom')

/**
 * @function logEvent
 *
 * @description Logs the event to Kafka
 *
 * @param {object} message Port to register the Server against
 *
 * @returns {Promise<true>} Returns if the logging of the event is successful or not
 */
const logEvent = async (message) => {
  return await kafkaUtil.produceGeneralMessage(Enums.eventType.EVENT, message, message.metadata.trace.traceId)
}

/**
 * @function handleRestRequest
 *
 * @description A temporary endpoint to cater for testing purposes for CEP-Tracing API
 *
 * @returns {boolean} Returns if the logging of the event is successful or not
 */
const handleRestRequest = async (request, h) => {
  try {
    await logEvent(request.payload)
    return h.response().code(200)
  } catch (e) {
    throw Boom.badRequest(e.message)
  }
}

module.exports = {
  logEvent,
  handleRestRequest
}