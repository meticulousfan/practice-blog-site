import "../styles/tailwind.css";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/apollo";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import ContextWrapper from "../components/Layout/ContextWrapper";
import Modal from "react-modal";

Modal.setAppElement("body");

const MyApp: NextPage<AppProps> = (props: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ContextWrapper {...props} />
    </ApolloProvider>
  );
};

export default MyApp;
