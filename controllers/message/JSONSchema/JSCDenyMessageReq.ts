import { JSONSchema6 } from 'json-schema'

const JSCDenyMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        deny: {
          type: 'boolean',
        },
        messageId: {
          type: 'string',
        },
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
      },
      required: ['deny', 'messageId', 'uid'],
    },
  },
  required: ['body'],
  type: 'object',
}

export default JSCDenyMessageReq
