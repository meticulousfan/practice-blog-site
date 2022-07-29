import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import Router from "next/router";
import Modal from "../../components/Modal/Create";
import { NextPage } from "next";

const BlogsQuery = gql`
  query {
    blogs {
      id
      title
      description
      category
      author {
        id
        name
        email
        role
      }
    }
  }
`;

const Home: NextPage<{}> = () => {
  const [inform, setInform] = useState({
    show: false,
    updated: false,
    blogs: [],
    loading: false,
    error: "",
  });

  const { data, loading, error, refetch } = useQuery(BlogsQuery);

  useEffect(() => {
    refetch(BlogsQuery);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>oh, no...{error.message}</p>;

  const showModal = (flag) => {
    setInform({
      ...inform,
      show: flag,
    });
  };

  const setUpdatedFlag = () => {
    refetch(BlogsQuery);
  };

  return (
    <div>
      <div className="container mx-auto max-w-5xl my-20">
        <div>
          <button onClick={() => showModal(true)}>+Create Blog</button>
        </div>
        <div>
          <Modal
            isOpen={inform.show}
            showModal={showModal}
            setUpdatedFlag={setUpdatedFlag}
          />
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.blogs.map((blog) => (
            <li key={blog.id} className="shadow  max-w-md  rounded">
              <div className="p-5 flex flex-col space-y-2">
                <Link href={`/blogs/${blog.id}`}>
                  <p className="text-lg font-medium hover">
                    <a>{blog.title}</a>
                  </p>
                </Link>
                <p className="text-sm text-blue-500">{blog.category}</p>
                <p className="text-gray-600">{blog.description}</p>
                <p className="text-gray-600">{blog.author.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
