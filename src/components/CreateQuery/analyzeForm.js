const md5 = require('md5.js')
import {
  templateQuery,
  templateLayer,
  templateFunc
} from 'assets/template_input_query.js'

function buildInputQuery(
  localquery,
  isEncrypted,
  targetProfile,
  layers_da,
  limitedObs,
  limit
) {
  // This function is going to inject string into a stringified json imported from template_input_query
  var jsonConcept = ''
  var jsonLayers = ''
  var jsonPsdConcept = ''
  var jsonTargetProfile = targetProfile.split('"').join('\\"')
  var jsonLayerArgs = ''
  var jsonFunc = ''

  // Extract an array of Concpets from the targetProfile
  var concepts = targetProfile
    .split(')OR')
    .join(',')
    .split(')AND')
    .join(',')
    .split('OR')
    .join('')
    .split('AND')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split(',')

  var i = 0
  var pseudoConcept = new Map()
  var conceptID
  var conceptPseudoAnonymized
  while (i < concepts.length) {
    // e.g. concepts[i]=conceptID="work=Paris"
    conceptID = concepts[i].substring(1, concepts[i].length - 1)
    conceptPseudoAnonymized = new md5().update('concepts' + i).digest('hex')

    // Add concept to jsonConcept
    jsonConcept = jsonConcept + '"' + conceptID + '",'

    // Add conceptPseudoAnonymized to pseudoConcept
    pseudoConcept.set(conceptID, conceptPseudoAnonymized)

    // Replace concept with pseudo-anonymised concept
    jsonTargetProfile = jsonTargetProfile
      .split(conceptID)
      .join(conceptPseudoAnonymized)
      .split('\\"')
      .join('')
    i = i + 1
  }

  // Delete the final ',' from jsonConcept
  jsonConcept = jsonConcept.substring(0, jsonConcept.length - 1)

  for (let [key, value] of pseudoConcept) {
    jsonPsdConcept = jsonPsdConcept + '"' + key + '":"' + value + '",'
  }
  jsonPsdConcept = jsonPsdConcept.substring(0, jsonPsdConcept.length - 1)

  // build jsonLayers from layers_da
  i = 0
  var j = 0
  while (i < layers_da.length) {
    j = 0
    jsonFunc = ''

    // Build jsonFunc for each function
    while (j < layers_da[i].layer_job.length) {
      jsonLayerArgs = ''
      for (var key in layers_da[i].layer_job[j].args) {
        if (layers_da[i].layer_job[j].args[key] != '') {
          jsonLayerArgs =
            jsonLayerArgs + `"${key}":"${layers_da[i].layer_job[j].args[key]}",`
        }
      }
      jsonLayerArgs = jsonLayerArgs.substring(0, jsonLayerArgs.length - 1)

      jsonFunc =
        jsonFunc +
        templateFunc
          .replace('//JOB//', layers_da[i].layer_job[j].func.value)
          .replace('//ARGS//', jsonLayerArgs) +
        ','

      j++
    }
    // Delete the final ',' from jsonFunc
    jsonFunc = jsonFunc.substring(0, jsonFunc.length - 1)

    jsonLayers =
      jsonLayers +
      templateLayer
        .replace('//JOBS//', jsonFunc)
        .replace('//SIZE//', layers_da[i].layer_size) +
      ','

    i++
  }
  // Delete the final ',' from jsonLayers
  jsonLayers = jsonLayers.substring(0, jsonLayers.length - 1)

  // Build Query
  var stringQuery = templateQuery
    .replace('//CONCEPT//', jsonConcept)
    .replace('//PSD-CONCEPT//', jsonPsdConcept)
    .replace('//LAYERS//', jsonLayers)
    .replace('//DOCTYPE//', localquery.value)
    .replace('//OPERATION//', jsonTargetProfile)
    .replace('//ENCRYPTED//', isEncrypted)

  if (!limitedObs) {
    stringQuery = stringQuery.replace('"limit": //LIMIT//,', '')
  }

  stringQuery = stringQuery.replace('//LIMIT//', limit)

  // Remote body need to be map[string]string
  // It's an association between var name and value
  // Vars are defined in remote-doctypes
  // In our case, stringQuery is called "data"
  return { data: stringQuery }
}

export { buildInputQuery }
