"use client"
import axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
    const [isSuccess, setIsSuccess] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    const url = "http://127.0.0.1:8000/api/login";

    await axios
      .post(url, values)
      .then((response) => {
        setIsSuccess(false);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          location.reload();
        }
        if (response.data.status === "error") {
            toast.success(response.data.message);
          }
        if (response.data.status === "failed") {
            console.log(response.data.errors)
          Object.values(response.data.errors).forEach((error) => {
            toast.error(error[0]);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
    <Toaster />
    <section className="bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-xl shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div className="mt-14 text-center">
                    <button
                      type="submit"
                      disabled={isSuccess}
                      className={`${
                        isSuccess ? "bg-teal-100" : "bg-teal-500"
                      } p-3 px-14 text-white font-semibold rounded-full`}
                    >
                      Login
                    </button>
                  </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
    </>
   
  );
};

export default Login;
