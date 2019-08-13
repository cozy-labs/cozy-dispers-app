const templateQuery = `{
  "concepts": [//CONCEPT//],
  "pseudo_concepts": {//PSD-CONCEPT//},
  "encrypted": //ENCRYPTED//,
  "local_query": {
    "findrequest": {
      "selector": {
        "_id": {
          "$gt": null
        }
      }
    },
    "doctype": "//DOCTYPE//",
		"index": {
		"fields": [
			"_id"
		]
		}
  },
  "target_profile": "//OPERATION//",
  "layers_da": [//LAYERS//]
}`

const templateLayer = `
{
  "layer_func": {
    "func": "//FUNC//",
    "args": {//ARGS//}
  },
  "layer_size": //SIZE//
}
`

export { templateQuery, templateLayer }
