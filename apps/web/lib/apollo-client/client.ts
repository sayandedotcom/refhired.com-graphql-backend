import { cookies } from "next/headers";

import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
  fetchOptions: { cache: "no-store" },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(graphQLErrors);
  }

  if (networkError) {
    // handle network error
    console.log(networkError);
  }
});

const authLink = setContext((_, { headers }) => {
  const cookieStore = cookies();
  const token =
    cookieStore.get("__Secure-next-auth.session-token") ?? cookieStore.get("next-auth.session-token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer from server ${token.value}` : "",
    },
  };
});

const appLink = from([errorLink, httpLink]);

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    link: authLink.concat(appLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
});

// export const { getClient } = registerApolloClient(() => {
//   return new ApolloClient({
//     cache: new InMemoryCache(),
//     link: new HttpLink({
//       uri: "http://localhost:8000/graphql",
//       credentials: "include",
//       fetchOptions: { cache: "no-store" },
//     }),
//   });
// });
