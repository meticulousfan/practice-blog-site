import React, { useEffect, useState } from "react";
import Header from "./Header";
import { NextPage } from "next";

const Layout: NextPage<{}> = (props) => {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
};

export default Layout;
