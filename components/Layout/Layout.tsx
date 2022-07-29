import React, { useEffect, useState } from "react";
import { ApolloProvider, useQuery, gql } from "@apollo/client";
import { AppProps } from "next/app";
import { NextPage } from "next";
import { useRouter } from "next/router";

import Layout from "../Layout";
import { token } from "../../lib/apollo";

export const UserContext = React.createContext({
  currentUser: null,
  setCurrentUser: (p: object | null) => {},
});

const GetUserProfileQuery = gql`
  query {
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
  const [localToken, setToken] = useState(token);
  const { data, loading, error, refetch } = useQuery(GetUserProfileQuery);
  useEffect(() => {
    if (!localToken) {
      router.push("/account/signin");
    } else {
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
