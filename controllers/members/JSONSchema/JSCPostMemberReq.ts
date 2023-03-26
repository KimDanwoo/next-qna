import { JSONSchema6 } from 'json-schema'

const JSCPostMemberReq: JSONSchema6 = {
  additionalProperties: false,
  properties: {
    body: {
      additionalProperties: false,
      properties: {
        uid: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        displayName: {
          type: 'string',
        },
        photoURL: {
          type: 'string',
        },
      },
      required: ['uid'],
      type: 'object',
    },
  },
  required: ['body'],
  type: 'object',
}

export default JSCPostMemberReq
