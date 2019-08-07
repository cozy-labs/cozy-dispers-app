const templateQuery = `{
  "concepts": [//CONCEPT//],
  "pseudo_concepts": {//PSD-CONCEPT//},
  "encrypted": //ENCRYPTED//,
  "localquery": {
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
  "operation": "//OPERATION//",
  "nb_actors": {
    "ci": 1,
    "tf": 1,
    "t": 1
  },
  "layers_da": [//LAYERS//]
}`

const templateLayer = `
{
  "layer_job": {
    "func": "//FUNC//",
    "args": {//ARGS//}
  },
  "layer_size": //SIZE//
}
`

export { templateQuery, templateLayer }
