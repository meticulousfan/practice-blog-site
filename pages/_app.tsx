// /pages/_app.tsx
import "../styles/tailwind.css";
import React, { useEffect, useState } from "react";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import apolloClient from "../lib/apollo";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import ContextWrapper from "../components/Layout/Layout";
import Modal from "react-modal";

Modal.setAppElement("body");

const MyApp: NextPage<AppProps> = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ContextWrapper {...props} />
    </ApolloProvider>
  );
};

export default MyApp;
