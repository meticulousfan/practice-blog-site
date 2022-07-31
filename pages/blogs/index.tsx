import React, { useEffect, useState } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import Modal from "../../components/Modal/Create";
import { NextPage } from "next";
import { Icon } from "@iconify/react";

const GET_BLOGS = gql`
  query GetBlogs {
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

type blog = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

const Home: NextPage<{}> = () => {
  const [inform, setInform] = useState({
    show: false,
    updated: false,
    blogs: [],
    loading: false,
    error: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_BLOGS);

  useEffect(() => {
    refetch(GET_BLOGS);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>oh, no...{error.message}</p>;

  const showModal = (flag: boolean): void => {
    setInform({
      ...inform,
      show: flag,
    });
  };

  const setUpdatedFlag = (): void => {
    refetch(GET_BLOGS);
  };

  return (
    <div>
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
        <div>
          <button
            onClick={() => showModal(true)}
            className="rounded bg-blue-500 hover:bg-blue-700 py-2 px-4 text-white"
          >
            <Icon icon="mdi-light:plus" className="inline"></Icon>Add blog
          </button>
        </div>
        <div>
          <Modal
            isOpen={inform.show}
            showModal={showModal}
            setUpdatedFlag={setUpdatedFlag}
          />
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
          {data?.blogs.map(
            (blog: blog): React.ReactNode => (
              <li key={blog.id}>
                <div className="rounded overflow-hidden shadow-lg">
                  <div className="px-6 py-4">
                    <Link href={`/blogs/${blog.id}`}>
                      <span className="text-2xl text-blue-600 hover:text-indigo-600 hover:cursor-pointer">
                        {blog.title}
                      </span>
                    </Link>
                    <p className="text-gray-500 text-sm">{blog.description}</p>
                    <p className="text-gray-500 text-sm">{blog.author.email}</p>
                  </div>
                  <div className="px-6 py-4 flex flex-row items-center">
                    <span className="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
                      <span className="ml-1">2022.7.30</span>
                    </span>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
