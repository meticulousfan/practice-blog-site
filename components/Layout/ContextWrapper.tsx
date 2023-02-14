import React, { useEffect, useState } from "react";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import { AppProps } from "next/app";
import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "./Layout";

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: (p: object | null): void => {},
});

const GET_PROFILE = gql`
  query GetProfile {
    getProfileByToken {
      id
      name
      email
      role
    }
  }
`;

const ContextWrapper: NextPage<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE);
  useEffect(() => {
    let token = "";
    if (typeof window !== undefined) {
      token = localStorage.getItem("token");
    }
    if (token) {
      if (data && data?.getProfileByToken) {
        setCurrentUser(data?.getProfileByToken);
      }
      if (error) router.push("/account/signin");
    }
  }, [data, error, currentUser]);

  const value = { currentUser, setCurrentUser };
  return (
    <UserContext.Provider value={value}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
};

export default ContextWrapper;
