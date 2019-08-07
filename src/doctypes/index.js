import { QUERIES_DOCTYPE } from './query'

// the documents schema, necessary for CozyClient
export default {
  train: {
    doctype: QUERIES_DOCTYPE,
    attributes: {},
    relationships: {}
  }
}

// export all doctypes for the application
export * from './query'
