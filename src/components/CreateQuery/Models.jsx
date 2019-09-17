const optionsModels = [
  { value: 'mean', label: 'Load Mean/Std' },
  { value: 'min', label: 'Load Min/Max' }
]

const blank = {
  selectedLayer: 1,
  localquery: null,
  layers_da: [
    {
      layer_job: [{ title: '', func: { label: '', value: '' }, args: {} }],
      layer_size: 1
    }
  ],
  limitedObs: false,
  tabTargetProfile: [],
  isEncrypted: false,
  labels: [],
  limit: 1000,
  targetProfile: '',
  name: ''
}

const min = {
  selectedLayer: 1,
  localquery: {
    label: 'io.cozy.bank.operations',
    value: 'io.cozy.bank.operations'
  },
  layers_da: [
    {
      layer_job: [
        {
          title: 'MIN(AMOUNT)',
          func: { label: 'Min', value: 'min' },
          args: { key: 'amount' }
        },
        {
          title: 'MAX(AMOUNT)',
          func: { label: 'Max', value: 'max' },
          args: {
            key: 'amount'
          }
        }
      ],
      layer_size: 15
    },
    {
      layer_job: [
        {
          title: 'MIN(MIN_AMOUNT)',
          func: { label: 'Min', value: 'min' },
          args: {
            sum: 'min_amount'
          }
        },
        {
          title: 'MAX(MAX_AMOUNT)',
          func: { label: 'Max', value: 'max' },
          args: {
            sum: 'max_amount'
          }
        }
      ],
      layer_size: 1
    }
  ],
  isEncrypted: false,
  labels: [{ label: 'Finance', value: 'finance' }],
  limit: 1000,
  tabTargetProfile: [
    'OR(',
    'OR(',
    '"travail=paris"',
    ',',
    '"travail=lille"',
    ')',
    'OR(',
    '"travail=saint-etienne"',
    ',',
    '"travail=rennes"',
    ')',
    ')'
  ],
  targetProfile:
    'OR(OR("travail=paris","travail=lille")OR("travail=saint-etienne","travail=rennes"))',
  isFinished: false,
  limitedObs: false
}

const mean = {
  selectedLayer: 1,
  localquery: {
    label: 'io.cozy.bank.operations',
    value: 'io.cozy.bank.operations'
  },
  layers_da: [
    {
      layer_job: [
        {
          title: 'SUM(AMOUNT)',
          func: { label: 'Sum', value: 'sum' },
          args: { key: 'amount' }
        },
        {
          title: 'SUM OF SQUARES(AMOUNT)',
          func: { label: 'Sum of squares', value: 'sum_square' },
          args: {
            key: 'amount'
          }
        }
      ],
      layer_size: 6
    },
    {
      layer_job: [
        {
          title: 'MEAN(SUM_AMOUNT)',
          func: { label: 'Mean', value: 'mean' },
          args: {
            sum: 'sum_amount'
          }
        },
        {
          title: 'STANDARD DEVIATION(SUM_AMOUNT,SUM_SQUARE_AMOUNT)',
          func: {
            label: 'Standard Deviation',
            value: 'standard_deviation'
          },
          args: {
            sum: 'sum_amount',
            sum_square: 'sum_square_amount'
          }
        }
      ],
      layer_size: 1
    }
  ],
  isEncrypted: false,
  labels: [{ label: 'Finance', value: 'finance' }],
  limit: 1000,
  tabTargetProfile: [
    'OR(',
    'OR(',
    '"travail=paris"',
    ',',
    '"travail=lille"',
    ')',
    'OR(',
    '"travail=saint-etienne"',
    ',',
    '"travail=rennes"',
    ')',
    ')'
  ],
  targetProfile:
    'OR(OR("travail=paris","travail=lille")OR("travail=saint-etienne","travail=rennes"))',
  isFinished: false,
  limitedObs: false
}

export { optionsModels, blank, mean, min }
