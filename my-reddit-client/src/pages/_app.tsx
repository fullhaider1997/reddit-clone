import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient } from "urql";
import theme from "../theme";
import { AppProps } from "next/app";
import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  RegisterMutation,
  MeDocument,
  MeQuery,
  Query,
  LogoutMutation,
} from "../generated/graphql";
import { ResolveLayoutTransition } from "framer-motion";
import Login from "./login";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
