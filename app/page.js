"use client";
import React, { useEffect, useRef, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { columnsData } from "@/constrants/fractional";
import axios from "axios";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const Home = () => {
  const [Data, setData] = useState([]);
  const router = useRouter();
  const cancelTokenSource = axios.CancelToken.source();

  const [selectedFile, setSelectedFile] = useState(null);

  const [isSuccess, setIsSucess] = useState(false);
  const [userData, setUserData] = useState({});
  const token = localStorage.getItem("token");
  const loggedUser = async () => {
    const url = "http://127.0.0.1:8000/api/loggeduser";
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data.status === "success") {
        setIsSucess(true);
        setUserData(response.data.data);
      }
    });
  };
  useEffect(() => {
    loggedUser();
  }, [token, isSuccess]);

  const fileInputRef = useRef(null);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    setSelectedFile(file);
    if (file) {
      await handleUpload(file);
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      fraction_view();
    } catch (error) {
      console.error("Error uploading CSV file:", error);
    }
  };

  const handleUpdatedata = (row) => {
    console.log(row.original);
    localStorage.setItem("update", JSON.stringify(row.original));

    //  Now navigate to the FractionalPage with the encoded slug
    router.push(`/update`);
  };
  const fraction_view = async () => {
    const url = "http://127.0.0.1:8000/api/view";
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Set the bearer token
      },
    };

    await axios
      .get(url, config)
      .then((response) => {
        setData(response.data.data);
        console.log(response.data.user)
      })
      .catch((error) => {
          console.log(error);
      });
  };
  useEffect(() => {
    fraction_view();
  }, []);
  const columns = useMemo(() => columnsData, []);
  const type = "fractional";
  const handleDelete = async (id) => {
    const url = `admin/fractional/delete/${id}/${type}`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios
      .post(url, {}, config)
      .then((response) => {
        toast.success(response.data.message);
        fraction_view();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportData = () => {
    csvExporter.generateCsv(Data);
  };
  const handleDeleteData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tickets-delete_all"
      );

      toast.success(response.data.message);
      fraction_view();
    } catch (error) {
      toast.error("Error uploading CSV file");
    }
  };
  const logoutHandle = async () => {
    const url = "http://127.0.0.1:8000/api/logout";
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Set the bearer token
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data.status === "success") {
        localStorage.removeItem("token");
        location.reload();
      }
    });
  };


  return (
    <div className={`md:m-10 my-10 overflow-x-auto text-black`}>
      <div className="flex justify-end">
        <button
          onClick={logoutHandle}
          className="bg-teal-500 p-3 px-8 rounded-full text-white"
        >
          Logout1
        </button>
      
      </div>
      <div className="md:flex justify-start items-center">
        <h3 className="text-xl uppercase md:py-5 md:px-5 p-3 font-medium text-center">
          UniMap Tracker
        </h3>
        <div className="flex justify-center items-center mb-2 md:mb-0">
          {userData.role === "admin" && (
            <div>
              <label
                htmlFor="csvFileInput"
                className="bg-teal-500 flex justify-center items-center px-6 rounded-full h-[45px] w-auto hover:bg-teal-900 uppercase text-base text-white"
              >
                Upload Export File
              </label>
              <input
                type="file"
                id="csvFileInput"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
      </div>
      <MaterialReactTable
        columns={columns}
        enableRowActions
        renderRowActions={({ row, table }) => (
          <div className="flex gap-5 justify-center items-center cursor-pointer">
            <Button
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={() => handleUpdatedata(row, table)}
              startIcon={<ModeEditIcon />}
              variant="contained"
              style={{
                backgroundColor: `${row.original.isComplete ? 'rgb(115 82 177,0.5)' : 'rgb(115 82 177)'}`, // Set your desired background color
              }}
              disabled={row.original.isComplete}
            >
              Update
            </Button>
          </div>
        )}
        positionToolbarAlertBanner="bottom"
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
          >
            {userData.role === "admin" && (
              <Button
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleExportData}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                style={{
                  backgroundColor: "rgb(115 82 177)", // Set your desired background color
                }}
              >
                Export All Data
              </Button>
            )}
           
            {userData.role === "admin" && (
              <Button
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={handleDeleteData}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                style={{
                  backgroundColor: "rgb(115 82 177)", // Set your desired background color
                }}
              >
                Delete All Data
              </Button>
            )}
            {userData.role === "admin" && (
              <Button
                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                onClick={() => router.push("/users")}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                style={{
                  backgroundColor: "rgb(115 82 177)", // Set your desired background color
                }}
              >
                Assign Count
              </Button>
            )}
          </Box>
        )}
        data={Data}
      />
    </div>
  );
};

export default Home;
