import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Modal from "../../../components/Modal/Edit";
import swal from "sweetalert";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../../../components/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type blog = {
  id: number;
  title: string;
  description: string;
  category: string;
  comments: [comment];
};

type comment = {
  id: number;
  description: string;
  blogId: number;
  authorId: number;
  author: user;
};

type user = {
  id: number;
  name: string;
  email: string;
};

const GET_BLOG = gql`
  query GetBlog($id: Int!) {
    blog(id: $id) {
      id
      title
      description
      category
      comments {
        id
        description
        blogId
        authorId
        author {
          id
          name
          email
        }
      }
      author {
        id
        name
        email
      }
    }
  }
`;

const REMOVE_BLOG = gql`
  mutation RemoveBlog($id: Int!) {
    removeBlog(id: $id) {
      id
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($blogId: Int!, $description: String!) {
    createComment(blogId: $blogId, description: $description) {
      blogId
      authorId
      description
    }
  }
`;

const Detail: NextPage<{}> = () => {
  const [inform, setInform] = useState({
    show: false,
  });
  const router = useRouter();
  const id = router.query.id;
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [removeBlog] = useMutation(REMOVE_BLOG);
  const { data, loading, error, refetch } = useQuery(GET_BLOG, {
    variables: { id: Number(id) },
  });
  const formSchema = Yup.object().shape({
    description: Yup.string().required("description is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const [createComment] = useMutation(CREATE_COMMENT);
  const onSubmit = (data: comment) => {
    const { description } = data;
    const variables = { description, blogId: Number(id) };
    try {
      toast
        .promise(createComment({ variables }), {
          loading: "Creating new comment..",
          success: "Blog successfully created!🎉",
          error: `Something went wrong 😥 Please try again -  ${error}`,
        })
        .then(() => {
          reFetchBlog();
        });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>oh, no...{error.message}</p>;

  const showModal = (flag: boolean): void => {
    setInform({
      ...inform,
      show: flag,
    });
  };

  const reFetchBlog = (): void => {
    refetch({ id: Number(id) });
  };

  const toggleDelete = (): void => {
    swal({
      text: "Are you sure to delete?",
      buttons: ["Close", "Ok"],
    }).then((status) => {
      if (status) {
        const variables = { id: Number(id) };
        toast
          .promise(removeBlog({ variables }), {
            loading: "Deleting new blog..",
            success: "Blog successfully removed!🎉",
            error: `Something went wrong 😥😥 Please try again -  ${error}`,
          })
          .then(() => {
            router.push("/blogs");
          });
      }
    });
  };

  return (
    <div className="relative">
      <div className="max-w-3xl mt-10 rounded overflow-hidden flex flex-col mx-auto text-center">
        <Toaster />
        <p className="max-w-3xl mx-auto text-xl sm:text-4xl font-semibold inline-block hover:text-indigo-600 transition duration-500 ease-in-out inline-block mb-2">
          {data?.blog.title}
        </p>
        <p className="text-gray-700 text-base leading-8 max-w-2xl mx-auto">
          {data?.blog.category} {`(${data?.blog.author.email})`}
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <p>{data?.blog.description}</p>
        {data?.blog.author.id == currentUser?.id && (
          <div className="ml-auto">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full mr-4"
              onClick={() => showModal(true)}
            >
              Edit
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
              onClick={() => toggleDelete()}
            >
              delete
            </button>
          </div>
        )}
      </div>
      <div className="max-w-3xl mx-auto">
        {data?.blog.comments.length ? (
          data?.blog.comments.map(
            (comment: comment, index: number): React.ReactNode => (
              <div key={`comment_${index}}`}>
                <span className="text-sm text-blue-500">
                  {comment.description}
                </span>{" "}
                <span className="text-sm text-gray-500">
                  {`(${comment.author.email})`}
                </span>
              </div>
            )
          )
        ) : (
          <p className="text-sm text-blue-500">No comment</p>
        )}
      </div>
      <div className="max-w-3xl mx-auto">
        <form
          className="grid grid-cols-1 gap-y-6 p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="text-center">Add a Comment</span>
          <div className="form-group mb-6">
            <textarea
              className="
                          form-control
                          block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
              id="exampleFormControlTextarea13"
              rows={3}
              placeholder="description"
              name="description"
              {...register("description", { required: true })}
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          >
            <span className="ml-3">Add a comment</span>
          </button>
        </form>
      </div>
      <Modal
        isOpen={inform.show}
        showModal={showModal}
        blogData={data?.blog}
        id={Number(id)}
        reFetchBlog={reFetchBlog}
      ></Modal>
    </div>
  );
};

export default Detail;
