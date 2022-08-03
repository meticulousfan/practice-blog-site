import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";

type signUpProps = {
  name: string;
  email: string;
  password: string;
};

const SIGN_UP = gql`
  mutation SingUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
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
      .oneOf([Yup.ref("password")], "Passwords does not match")
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const [signUp, { loading, error }] = useMutation(SIGN_UP);

  const onSubmit = (data: signUpProps): void => {
    const { name, email, password } = data;
    const variables = { name, email, password };
    try {
      toast
        .promise(signUp({ variables }), {
          loading: "Creating new User..",
          success: "User successfully created!🎉",
          error: `Something went wrong 😥 Please try again -  ${error}`
        })
        .then((data) => {
          router.push("/account/signin");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto mt-5 bg-white shadow sm:rounded-lg flex justify-center">
      <Toaster />
      <div className="w-full p-6 sm:p-12">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
          <div className="w-full flex-1 mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  sign up with e-mail
                </div>
              </div>
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  data-cy="name"
                  type="name"
                  name="name"
                  {...register("name", { required: true })}
                  placeholder="name"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  data-cy="email"
                  type="email"
                  name="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  data-cy="password"
                  type="password"
                  {...register("password")}
                  name="password"
                  placeholder="Password"
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  data-cy="password_confirm"
                  placeholder="confirm password"
                  {...register("confirmPwd")}
                  name="confirmPwd"
                  type="password"
                />
                <div className="invalid-feedback">
                  {errors.confirmPwd?.message}
                </div>
                <button
                  type="submit"
                  data-cy="submit"
                  className="signup-button mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Sign Up</span>
                </button>
                <Link href="/account/signin">Link to signin page</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
