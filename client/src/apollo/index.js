import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import store from "../redux/store";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.qid;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// {
//   __typename: "Todo",
//   text: "First todo",
//   completed: false,
//   date: "2020-07-08T15:05:32.248Z",
//   user: {
//     email: "me@apollographql.com",
//   }
// }

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Todo: {
        // keyFields:["todoId"],
        // keyFields: ["date", "user", ["email"]],
      },
    },
  }),
});

export default client;
