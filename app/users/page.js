"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { toast } from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const Users = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [TicketData, seTicketsData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [userSelected,setuserSelected] = useState('')
  const [userSelectedid,setuserSelectedid] = useState('')

 

  const router = useRouter();
  const token = localStorage.getItem("token");
  const AllUsers = async () => {
    const url = "http://127.0.0.1:8000/api/users";
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios.get(url, config).then((response) => {
      setUsersData(response.data.users);
    });
  };
  const AllTickets = async () => {
    const url = "http://127.0.0.1:8000/api/allTickets";
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios.get(url, config).then((response) => {
      seTicketsData(response.data.ticket);
    });
  };
  useEffect(() => {
    AllUsers();
    AllTickets();
  }, [token]);

  const usersName = usersData.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });




  const initialValues = {
    user: "",
    selectedOptions: "",
  };
  const handleTypeSelect = (user) => {
    setuserSelected(user.label);
    setuserSelectedid(user.value)
  };

  const handleMouseDown = (e) => {
    const selectedText = window.getSelection().toString();

    if (selectedText) {
      // Add the selected text to the list of selected data
      setSelectedData([...selectedData, selectedText]);
    }
  };
  const arr = selectedData.toString().replace(/\n/g, '').split(",")
  const removeBlanksValue = arr.filter(elm => elm)
  const TicketsIds = removeBlanksValue.filter((item,
    index) => removeBlanksValue.indexOf(item) === index);

    const handleSubmit = async (values) => {
      console.log(selectedData)
      setIsSuccess(true)
      if(userSelectedid === ''){
       toast.error('user field is required')
        setIsSuccess(false);
        return;
      }
      if(selectedData.length === 0){
        toast.error('count field is required')
        setIsSuccess(false);
        return;
      }
      const url = "http://127.0.0.1:8000/api/update-user-id";
      const config = {
        headers: {
            'Authorization': `Bearer ${token}` // Set the bearer token
        }
    };
    await axios
      .post(url, {TicketsIds,userSelectedid},config)
      .then((response) => {
        setIsSuccess(false);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          AllTickets()
          setSelectedData([])
        }
        if (response.data.status === "error") {
            toast.success(response.data.message);
          }
      })
      .catch((error) => {
        console.error(error);
      });
    };
  return (
    <>
      {
        <section className="w-full h-screen flex justify-center py-10">
          <div className="lg:shadow-lg md:w-[800px] lg:p-20 lg:rounded-xl p-10">
            <h3 className="text-center pb-5 text-2xl uppercase font-semibold select-none">
              Update Your Fields
            </h3>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form encType="multipart/form-data">
                  <div className="grid gap-6 gap-y-2 md:grid-cols-2">
                    <div>
                      <label
                        className={`block py-2 text-base lg:text-base font-medium text-gray-900 select-none`}
                      >
                        Users
                      </label>
                      <Select
                        id="user"
                        name="user"
                        className="select-none"
                        options={usersName}
                        onChange={(selected) => {
                          setFieldValue("user", selected);
                          handleTypeSelect(selected); // This line is for logging purposes
                        }}
                      />
                    </div>
                    <div className="w-full">
                    <label
                        className={`block py-2 text-base lg:text-base font-medium text-gray-900 select-none`}
                      >
                         Unselect All
                      </label>
                      <button onClick={() => setSelectedData([])} className="select-none bg-teal-500 w-full py-1.5 rounded-sm text-white hover:bg-teal-300 uppercase">unselect all</button>
                    </div>
                    <div>
                      <label
                        className={`block py-2 text-base lg:text-base font-medium text-gray-900 select-none`}
                      >
                      Counts
                      </label>
                      <div
                        onMouseDown={handleMouseDown}
                        style={{
                          border: "1px solid #ccc",
                          padding: "10px",
                          overflow:"auto",
                          height:"200px",
                          position:"relative"
                        }}
                        suppressContentEditableWarning={true}
                      >
                          {
                            TicketData.map((item,index) => {
                              return (
                                <ul key={item.unique_id } className="overflow-hidden flex">
                                  <li>{item.unique_id},</li>
                                </ul>
                              )
                            })
                          }
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block py-2 text-base lg:text-base font-medium text-gray-900 select-none`}
                      >
                      Selected Data
                      </label>
                    <div 
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    overflow:"auto",
                    height:"200px",
                    position:"relative"
                  }}
                  className="select-none"
                  >
                    <span>No</span><span className="px-6">Counts</span> <span className="">user</span> {TicketsIds.map((item,index) => {
                      return (
                        <ul className="flex gap-10 select-none" key={index}>
                          <li>{index + 1}</li>
                          <li>{item}</li>
                          <li>{userSelected}</li>
                        </ul>
                      )
                    })}
                    </div>
                  </div>
                  </div>

                  <div className="mt-14 text-center">
                    <button
                      type="submit"
                      disabled={isSuccess}
                      className={`${
                        isSuccess ? "bg-teal-100" : "bg-teal-500"
                      } p-3 px-14 text-white font-semibold rounded-full`}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      }
    </>
  );
};

export default Users;
