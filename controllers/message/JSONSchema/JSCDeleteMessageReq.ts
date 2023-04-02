import { JSONSchema6 } from 'json-schema'

const JSCDeleteMessageReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        uid: {
          description: 'auth를 통해서 발급된 고유 id',
          type: 'string',
        },
        messageId: {
          type: 'string',
        },
      },
      required: ['messageId', 'uid'],
    },
  },
  required: ['body'],
  type: 'object',
}

export default JSCDeleteMessageReq
