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
  mutation ($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      token
      message
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const Signin: NextPage<{}> = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [signinError, setSigninError] = useState("");
  useEffect(() => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }, []);
  const router = useRouter();
  const formSchema = Yup.object().shape({
    password: Yup.string().required("Password is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const [signin, { loading, error }] = useMutation(UserMutation);

  const onSubmit = (data) => {
    const { email, password } = data;
    const variables = { email, password };
    signin({ variables }).then((data) => {
      if (data && data.data.signin.token) {
        localStorage.setItem("token", data.data.signin.token);
        setCurrentUser(data?.data.signin.user);
        router.push("/blogs");
      } else {
        setSigninError(data.data.signin.message);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Login</h1>
      <div className="invalid-feedback">{signinError}</div>
      <form
        className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="block">
          <span className="text-gray-700">email</span>
          <input
            placeholder="email"
            name="email"
            type="text"
            {...register("email", { required: true })}
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
        <button
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          submit
        </button>
        <Link href="/account/signup">Link to signup page</Link>
      </form>
    </div>
  );
};

export default Signin;
