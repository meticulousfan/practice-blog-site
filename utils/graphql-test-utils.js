export const join_graphQL = (query, extra = {}) => {
  return `mutation {
    ${query}(join: { email: "${extra.email}", password: "${extra.password}" }) {
              id, name, email
          }
  }`;
};

export const graphqlReqConfig = (
  body = {},
  api = "http://localhost:3000/graphql",
  method = "POST"
) => {
  return {
    method,
    body,
    url: api,
    failOnStatusCode: false
  };
};
