import Modal from "react-modal";
import { set, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { NextPage } from "next";

const BlogMutation = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $category: String!
  ) {
    editBlog(
      id: $id
      title: $title
      description: $description
      category: $category
    ) {
      title
      description
      category
    }
  }
`;

type Props = {
  isOpen: Boolean;
  showModal: Function;
  reFetchBlog?: Function;
  blogData: Object;
  id: Number;
};

const ModalConfirm: NextPage<Props> = ({
  isOpen,
  showModal,
  reFetchBlog,
  blogData,
  id,
}) => {
  const formSchema = Yup.object().shape({
    title: Yup.string().required("title is mendatory"),
    description: Yup.string().required("description is mendatory"),
    category: Yup.string().required("category is mendatory"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const [editBlog, { loading, error }] = useMutation(BlogMutation);
  const onSubmit = (data) => {
    const { title, description, category } = data;
    const variables = { title, description, category, id };
    try {
      toast
        .promise(editBlog({ variables }), {
          loading: "updating new blog..",
          success: "Blog successfully updated!🎉",
          error: `Something went wrong 😥 Please try again -  ${error}`,
        })
        .then((res) => {
          if (res) {
            reFetchBlog();
            showModal(false);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="block p-6 rounded-lg bg-white">
        <form
          className="grid grid-cols-1 gap-y-6 p-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <span>Edit a blog</span>
          <div className="form-group mb-6">
            <input
              type="text"
              className="form-control block
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
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleInput7"
              placeholder="title"
              name="title"
              defaultValue={blogData.title}
              {...register("title", { required: true })}
            />
          </div>
          <div className="form-group mb-6">
            <input
              type="text"
              className="form-control block
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
                        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleInput7"
              placeholder="category"
              name="category"
              defaultValue={blogData.description}
              {...register("category", { required: true })}
            />
          </div>
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
              rows="3"
              placeholder="description"
              name="description"
              defaultValue={blogData.category}
              {...register("description", { required: true })}
            ></textarea>
          </div>
          <button
            type="submit"
            className="
      w-full
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
            Update
          </button>
          <button
            type="button"
            className="
      w-full
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
            onClick={() => showModal(false)}
          >
            cancel
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
