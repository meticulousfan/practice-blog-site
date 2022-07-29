import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { UserContext } from "../../components/Layout/Layout";

const UserMutation = gql`
  mutation ($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      message
      user {
        name
        email
      }
    }
  }
`;
const Signup: NextPage<{}> = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const router = useRouter();

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is mendatory")
      .min(3, "Password must be at 3 char long"),
    confirmPwd: Yup.string()
      .required("Password is mendatory")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [signup, { loading, error }] = useMutation(UserMutation);

  const onSubmit = (data) => {
    const { name, email, password } = data;
    const variables = { name, email, password };
    try {
      toast
        .promise(signup({ variables }), {
          loading: "Creating new User..",
          success: "User successfully created!🎉",
          error: `Something went wrong 😥 Please try again -  ${error}`,
        })
        .then((data) => {
          router.push("/account/signin");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Register</h1>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">name</span>
          <input
            placeholder="name"
            name="name"
            type="text"
            {...register("name", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">email</span>
          <input
            placeholder="email"
            {...register("email", { required: true })}
            name="email"
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">password</span>
          <input
            placeholder="password"
            {...register("password")}
            name="password"
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </label>
        <label className="block">
          <span className="text-gray-700">Confirm password</span>
          <input
            placeholder="confirm password"
            {...register("confirmPwd")}
            name="confirmPwd"
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <div className="invalid-feedback">{errors.confirmPwd?.message}</div>
        </label>

        <button
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          submit
        </button>
        <Link href="/account/signin">Link to signin page</Link>
      </form>
    </div>
  );
};

export default Signup;
