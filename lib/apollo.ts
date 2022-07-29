import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "http://localhost:3000/api/graphql" });
export let token = "";
if (typeof window !== "undefined") {
  token = localStorage.getItem("token");
}
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: token || "",
    },
  });
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: "BlogSite",
  version: "1.0",
});

export default apolloClient;
