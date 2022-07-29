import React, { useEffect, useContext, useState } from "react";
import Link from "next/link";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import AppContext from "../../context/state";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { UserContext } from "../Layout/Layout";

const Header = () => {
  const router = useRouter();
  const [inform, setInform] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };
  const logOut = () => {
    router.push("/account/signin");
  };

  return (
    <header>
      {currentUser && (
        <div className="px-4 py-2 text-white flex  justify-between bg-blue-900">
          <h1>LOGO</h1>
          <div
            className={
              toggleMenu
                ? "md:flex  md:pt-0 pt-10 w-full md:w-auto"
                : "hidden md:flex"
            }
            id="menu"
          >
            <ul>
              <li className="md:inline-block cursor-pointer hover:text-gray-500 border-b md:border-none py-2 px-3">
                <Link href="/blogs">Blogs</Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="py-2 px-2 md:border-none">
              {currentUser?.name}
            </span>
            <button
              className="py-2 md:border-none bg-gray-400 text-color-dark rounded"
              onClick={() => logOut()}
            >
              logout
            </button>
          </div>
          <div className="cursor-pointer md:hidden">
            <input className="menu-btn hidden" type="checkbox" id="menu-btn" />
            <label
              className="menu-icon block cursor-pointer md:hidden px-2 py-4 relative select-none"
              htmlFor="menu-btn"
            >
              <span
                onClick={handleToggle}
                className="navicon bg-white-darkest flex items-center relative"
              ></span>
            </label>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
