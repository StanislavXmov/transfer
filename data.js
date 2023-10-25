export const graph1 = {
  nodes: [
    {
      node: 0,
      name: 'Signings'
    },
    {
      node: 1,
      name: 'Top Leagues'
    },
    {
      node: 2,
      name: '1st Tier, ex. Top Leagues'
    },
    {
      node: 3,
      name: '2nd Tier & Reserve League'
    },
    {
      node: 4,
      name: '3rd, 4th & 5th  Tiers'
    },
    {
      node: 5,
      name: 'Youth League'
    },
    {
      node: 6,
      name: 'No Tier'
    },
  ],
  links: [
    {
      source: 1,
      target: 0,
      value: 638
    },
    {
      source: 2,
      target: 0,
      value: 285
    },
    {
      source: 3,
      target: 0,
      value: 340
    },
    {
      source: 4,
      target: 0,
      value: 197
    },
    {
      source: 5,
      target: 0,
      value: 67
    },
    {
      source: 6,
      target: 0,
      value: 28
    },
  ]
}

export const graph2 = {
  nodes: [
    {
      node: 0,
      name: 'Outings'
    },
    {
      node: 1,
      name: 'Top Leagues'
    },
    {
      node: 2,
      name: '1st Tier, ex. Top Leagues'
    },
    {
      node: 3,
      name: '2nd Tier & Reserve League'
    },
    {
      node: 4,
      name: '3rd, 4th & 5th  Tiers'
    },
    {
      node: 5,
      name: 'Youth League'
    },
    {
      node: 6,
      name: 'No Tier'
    },
    {
      node: 7,
      name: 'Retiered'
    },
  ],
  links: [
    {
      source: 0,
      target: 1,
      value: 638
    },
    {
      source: 0,
      target: 2,
      value: 367
    },
    {
      source: 0,
      target: 3,
      value: 405
    },
    {
      source: 0,
      target: 4,
      value: 230
    },
    {
      source: 0,
      target: 5,
      value: 2
    },
    {
      source: 0,
      target: 6,
      value: 95
    },
    {
      source: 0,
      target: 7,
      value: 18
    },
  ]
}