import { getApolloClient, FaustProvider } from "@faustwp/core";

export function client() {
  return getApolloClient({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  });
}

export { FaustProvider };
