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
      },
      "limit": //LIMIT//
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
  "layer_func": [//FUNCS//],
  "layer_size": //SIZE//
}
`

const templateFunc = `
{
  "func": "//FUNC//",
  "args": {//ARGS//}
}
`

export { templateQuery, templateLayer, templateFunc }
