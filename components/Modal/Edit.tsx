import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { NextPage } from "next";
import { useRouter } from "next/router";
const customStyles = {
  content: {
    width: "50%",
    top: "50%",
    left: "50%",
    right: "50%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const EDIT_BLOG = gql`
  mutation EditBlog(
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
  isOpen: boolean;
  showModal: (flag: boolean) => void;
  reFetchBlog?: () => void;
  blogData: Blog;
};

type Blog = {
  title: string;
  category: string;
  description: string;
};

const ModalConfirm: NextPage<Props> = ({
  isOpen,
  showModal,
  reFetchBlog,
  blogData
}) => {
  const router = useRouter();
  const id = Number(router.query.id);
  const formSchema = Yup.object().shape({
    title: Yup.string().required("title is mendatory"),
    description: Yup.string().required("description is mendatory"),
    category: Yup.string().required("category is mendatory")
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const [editBlog] = useMutation(EDIT_BLOG);
  const onSubmit = (data: Blog) => {
    const { title, description, category } = data;
    const variables = { title, description, category, id: id };
    try {
      editBlog({ variables }).then((res) => {
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
    <Modal isOpen={isOpen} style={customStyles}>
      <div className="max-w-screen-md mx-auto rounded-lg bg-white">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900 text-center">
            Post <span className="text-indigo-600">blog</span>
          </h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Title
              </label>
            </div>
            <input
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-email"
              placeholder="title"
              name="title"
              defaultValue={blogData.title}
              data-cy="modal-title"
              {...register("title", { required: true })}
            />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Category
              </label>
            </div>
            <input
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-email"
              placeholder="title"
              name="category"
              defaultValue={blogData.category}
              data-cy="modal-category"
              {...register("category", { required: true })}
            />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                description
              </label>
              <textarea
                rows={10}
                name="description"
                {...register("description", { required: true })}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                data-cy="modal-description"
              >
                {blogData.description}
              </textarea>
            </div>
          </div>
          <div className="flex justify-between w-full px-3">
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="submit"
              data-cy="modal-submit"
            >
              Save
            </button>
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="button"
              data-cy="modal-cancel"
              onClick={() => showModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
