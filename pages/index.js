import { Inter } from "next/font/google";
import { Toaster, toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "@/axios/axios";
import Swal from "sweetalert2";
import { verifyAge, checkFileType } from "@/utils/utils";
import Select from "react-select";

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [residentialStreet1, setResidentialStreet1] = useState("");
  const [residentialStreet2, setResidentialStreet2] = useState("");
  const [permanentStreet1, setPermanentStreet1] = useState("");
  const [permanentStreet2, setPermanentStreet2] = useState("");
  const [fileName1, setFileName1] = useState("");
  const [fileType1, setFileType1] = useState("");
  const [file1, setFile1] = useState(null);
  const [fileName2, setFileName2] = useState("");
  const [fileType2, setFileType2] = useState("");
  const [file2, setFile2] = useState(null);
  const [sameAsResidential, setSameAsResidential] = useState(false);

  const type = [
    { value: "jpg", label: "jpg" },
    { value: "png", label: "png" },
  ];
  const [fileTypes, setfileTypes] = useState(type);

  const fileInput1 = useRef();
  const fileInput2 = useRef();
  const selectInputRef = useRef();
  const selectInputRef2 = useRef();
  useEffect(() => {
    toast.success("Welcome user!");
  }, []);

  useEffect(() => {
    if (sameAsResidential) {
      if (residentialStreet1 != "") {
        setPermanentStreet1(residentialStreet1);
        if (residentialStreet2 != "") {
          setPermanentStreet2(residentialStreet2);
        }
      } else {
        toast.error("please fill residential address first");
        setSameAsResidential(false);
      }
    } else {
      setPermanentStreet1("");
      setPermanentStreet2("");
    }
  }, [sameAsResidential]);
  function handleForm(e) {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Warning",
        text: "Are you sure you want to submit the form?",
        showDenyButton: true,
        icon: "warning",
        confirmButtonText: "Yes ",
        denyButtonText: `No`,
        customClass: {
          confirmButton: "btn-confirm",
          denyButton: "btn-deny",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          finallySubmit();
        } else if (result.isDenied) {
          toast.error("Cancelled");
        }
      });

      async function finallySubmit() {
        const formData = new FormData();

        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("dob", dob);
        formData.append("street1", residentialStreet1);
        formData.append("street2", residentialStreet2);
        formData.append("street3", permanentStreet1);
        formData.append("street4", permanentStreet2);
        formData.append("file1", file1);
        formData.append("file2", file2);
        formData.append("file1name", fileName1);
        formData.append("file2name", fileType2);

        if (
          !firstName ||
          !lastName ||
          !email ||
          !dob ||
          !residentialStreet1 ||
          !permanentStreet1 ||
          !file1 ||
          !file2 ||
          !fileName1 ||
          !fileType2 ||
          !fileName2 ||
          !fileType1
        ) {
          toast.error("Please fill in all fields");
          return;
        } else {
          const age = verifyAge(dob);

          if (age) {
            if (
              checkFileType(file1, fileType1) &&
              checkFileType(file2, fileType2)
            ) {
              try {
                const result = await axiosInstance.post(
                  "/form/api/handleForm",
                  formData
                );
                console.log("==>", result);
                if (result.status == 200) {
                  toast.success("Records saved");
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setDob("");
                  setResidentialStreet1("");
                  setResidentialStreet2("");
                  setPermanentStreet1("");
                  setPermanentStreet2("");
                  setFileName1("");
                  setFileType1("");
                  setFile1(null);
                  setFileName2("");
                  setFileType2("");
                  setFile2(null);
                  fileInput1.current.value = "";
                  fileInput2.current.value = "";
                  selectInputRef.current.clearValue();
                  selectInputRef2.current.clearValue();
                  setSameAsResidential(false);
                }
              } catch (err) {
                console.log(err.message);
              }
            } else {
              toast.error("one of the file types does not match the file");
            }
          } else {
            toast.error("age should be greater than 18");
          }
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <>
      <Toaster position="top-right" />

      <div className="w-3/5 mx-auto">
        <form className="mt-8 space-y-6" onSubmit={handleForm}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name <span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 block w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 block w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                className="mt-1 block w-full"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="residentialStreet1"
                className="block text-sm font-medium text-gray-700"
              >
                Residential Street 1<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="residentialStreet1"
                name="residentialStreet1"
                type="text"
                required
                className="mt-1 block w-full"
                value={residentialStreet1}
                onChange={(e) => setResidentialStreet1(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="residentialStreet2"
                className="block text-sm font-medium text-gray-700"
              >
                Residential Street 2
              </label>
              <input
                id="residentialStreet2"
                name="residentialStreet2"
                type="text"
                className="mt-1 block w-full"
                value={residentialStreet2}
                onChange={(e) => setResidentialStreet2(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/2 flex gap-2">
            <label
              htmlFor="sameAsResidential"
              className=" text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Same as Residential Address
            </label>
            <input
              id="sameAsResidential"
              name="sameAsResidential"
              type="checkbox"
              className=""
              checked={sameAsResidential}
              onChange={(e) => {
                console.log("checkbox value", e.target.checked);
                setSameAsResidential(e.target.checked);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="permanentStreet1"
                className="block text-sm font-medium text-gray-700"
              >
                Permanent Street 1
              </label>
              <input
                id="permanentStreet1"
                name="permanentStreet1"
                type="text"
                className="mt-1 block w-full"
                value={permanentStreet1}
                onChange={(e) => setPermanentStreet1(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="permanentStreet2"
                className="block text-sm font-medium text-gray-700"
              >
                Permanent Street 2
              </label>
              <input
                id="permanentStreet2"
                name="permanentStreet2"
                type="text"
                className="mt-1 block w-full"
                value={permanentStreet2}
                onChange={(e) => setPermanentStreet2(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="fileName1"
                className="block text-sm font-medium text-gray-700"
              >
                File Name 1<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="fileName1"
                name="fileName1"
                type="text"
                required
                className="mt-1 block w-full"
                value={fileName1}
                onChange={(e) => setFileName1(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="fileType1"
                className="block text-sm font-medium text-gray-700"
              >
                File Type 1<span className="mx-1 text-red-700">*</span>
              </label>
              <Select
                ref={selectInputRef}
                defaultValue={fileType1}
                id="fileType1"
                name="fileType1"
                required
                className="mt-1 block w-full selectbox"
                options={fileTypes}
                onChange={(e) => {
                  setFileType1(e?.value);
                  console.log("filetype 1", e?.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="file1"
                className="block text-sm font-medium text-gray-700"
              >
                File 1<span className="mx-1 text-red-700">*</span>
              </label>

              <input
                ref={fileInput1}
                id="file1"
                name="file1"
                type="file"
                required
                className="mt-1 block w-full"
                onChange={(e) => setFile1(e.target.files[0])}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="fileName2"
                className="block text-sm font-medium text-gray-700"
              >
                File Name 2<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                id="fileName2"
                name="fileName2"
                type="text"
                required
                className="mt-1 block w-full"
                value={fileName2}
                onChange={(e) => setFileName2(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="fileType2"
                className="block text-sm font-medium text-gray-700"
              >
                File Type 2<span className="mx-1 text-red-700">*</span>
              </label>
              <Select
                ref={selectInputRef2}
                defaultValue={fileType2}
                id="fileType2"
                name="fileType2"
                type="text"
                required
                className="mt-1 block w-full selectbox"
                options={fileTypes}
                onChange={(e) => {
                  setFileType2(e?.value);
                  console.log("filetype 2", e?.value);
                }}
              />
            </div>
            <div>
              <label
                htmlFor="file2"
                className="block text-sm font-medium text-gray-700"
              >
                File 2<span className="mx-1 text-red-700">*</span>
              </label>
              <input
                ref={fileInput2}
                id="file2"
                name="file2"
                type="file"
                required
                className="mt-1 block w-full"
                onChange={(e) => setFile2(e.target.files[0])}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center pb-6">
            <button type="submit" className="w-1/2 py-2 px-4">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
