import { useContext, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { set, useForm } from "react-hook-form";
import { gql, useQuery, useMutation } from "@apollo/client";
import Router, { useRouter } from "next/router";
import { NextPage } from "next";
import Modal from "../../../components/Modal/Edit";
import swal from "sweetalert";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../../../components/Layout/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const BlogsQuery = gql`
  query ($id: Int!) {
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

const removeBlogMutation = gql`
  mutation ($id: Int!) {
    removeBlog(id: $id) {
      id
    }
  }
`;

const Create_Comment = gql`
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
  const [removeBlog] = useMutation(removeBlogMutation);
  const { data, loading, error, refetch } = useQuery(BlogsQuery, {
    variables: { id: Number(id) },
  });
  const formSchema = Yup.object().shape({
    description: Yup.string().required("description is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [createComment] = useMutation(Create_Comment);
  const onSubmit = (data) => {
    const { description } = data;
    const variables = { description, blogId: Number(id) };
    try {
      toast
        .promise(createComment({ variables }), {
          loading: "Creating new comment..",
          success: "Blog successfully created!🎉",
          error: `Something went wrong 😥 Please try again -  ${error}`,
        })
        .then((res) => {
          reFetchBlog();
        });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>oh, no...{error.message}</p>;

  const showModal = (flag) => {
    setInform({
      ...inform,
      show: flag,
    });
  };

  const reFetchBlog = () => {
    refetch({ id: Number(id) });
  };

  const toggleDelete = () => {
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
    <div>
      <Toaster />
      <div className="container mx-auto max-w-5xl my-20">
        <div>
          <p className="text-sm text-blue-500">{data?.blog.category}</p>
          <p className="text-gray-600">{data?.blog.title}</p>
          <p className="text-gray-600">{data?.blog.description}</p>
          <p className="text-gray-600">{data?.blog.author.email}</p>
          {data?.blog.author.id == currentUser?.id && (
            <div>
              <button className="bg-gray mx-2" onClick={() => showModal(true)}>
                Edit
              </button>
              <button className="bg-gray" onClick={() => toggleDelete()}>
                delete
              </button>
            </div>
          )}
        </div>
        {data?.blog.comments.length ? (
          data?.blog.comments.map((comment, index) => (
            <div key={`comment_${index}}`}>
              <span className="text-sm text-blue-500">
                {comment.description}
              </span>{" "}
              <span className="text-sm text-gray-500">
                {`(${comment.author.email})`}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-blue-500">No comment</p>
        )}
        <div className="block p-6 rounded-lg bg-white">
          <form
            className="grid grid-cols-1 gap-y-6 p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <span>Add a Comment</span>
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
              className="
                w-25
                px-6
                py-2.5
                bg-blue-600
                text-white
                font-medium
                text-xs
                leading-tight
                uppercase
                rounded
                shadow-md
                hover:bg-blue-700 hover:shadow-lg
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                active:bg-blue-800 active:shadow-lg
                transition
                duration-150
                ease-in-out"
            >
              Send
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
    </div>
  );
};

export default Detail;
