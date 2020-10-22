import type { GraphQLFetcher } from 'lib/commerce/api'
import { getConfig } from '..'
import log from '@lib/logger'

const fetchGraphqlApi: GraphQLFetcher = async (
  query: string,
  { variables, preview } = {},
  fetchOptions
) => {
  // log.warn(query)
  const config = getConfig()
  const res = await fetch(config.commerceUrl + (preview ? '/preview' : ''), {
    ...fetchOptions,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      ...fetchOptions?.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch BigCommerce API')
  }

  return { data: json.data, res }
}

export default fetchGraphqlApi
