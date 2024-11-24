// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import axios from "axios";

// const ProfilePage = () => {
//   const [user, setUser] = useState({
//     userId: "",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     profilePicture: "",
//   });

//   const [editedUser, setEditedUser] = useState({ ...user });
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const storedUserData = JSON.parse(localStorage.getItem("user"));
//     if (storedUserData) {
//       setUser({
//         userId: storedUserData._id,
//         name: storedUserData.name,
//         email: storedUserData.email,
//         phone: storedUserData.phoneNo,
//         address: storedUserData.address,
//         profilePicture: storedUserData.avatar?.url || "/images/signup.jpg",
//       });
//       setEditedUser({
//         userId: storedUserData._id,
//         name: storedUserData.name,
//         email: storedUserData.email,
//         phone: storedUserData.phoneNo,
//         address: storedUserData.address,
//         profilePicture: storedUserData.avatar?.url || "/images/signup.jpg",
//       });
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedUser({ ...editedUser, [name]: value });
//   };

//   const handleProfilePictureChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setEditedUser({ ...editedUser, profilePicture: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveChanges = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("userId", user.userId);
//       formData.append("name", editedUser.name);
//       formData.append("email", editedUser.email);
//       formData.append("phoneNo", editedUser.phone);
//       formData.append("address", editedUser.address);

//       if (editedUser.profilePicture.startsWith("data:image")) {
//         const blob = await fetch(editedUser.profilePicture).then(res => res.blob());
//         formData.append("profilePicture", blob, "profilePicture.png");
//       }

//       const response = await axios.put(
//         "http://localhost:5000/api/auth/update",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       setUser(response.data.user);
//       setShowModal(false);
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-stone-300 min-h-screen">
//       <Header />
//       <div className="relative w-full h-80 mb-8">
//         <div className="absolute inset-0">
//           <img
//             src={"/images/welcome1.png"}
//             alt="Cover"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="absolute left-8 top-48 w-44 h-44 bg-gray-300 rounded-full overflow-hidden border-4 border-white">
//           {editedUser.profilePicture ? (
//             <img
//               src={editedUser.profilePicture}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <span className="text-3xl font-bold text-slate-700">
//               {user.name.charAt(0)}
//             </span>
//           )}
//         </div>
//       </div>
//       <div className="container mx-auto p-8 mt-8">
//         <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex-1">
//               <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
//               <p className="text-gray-600">{user.email}</p>
//             </div>
//             <div className="mr-[588px]">
//               <label
//                 htmlFor="profilePicture"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Update Profile Picture
//               </label>
//               <input
//                 type="file"
//                 id="profilePicture"
//                 accept="image/*"
//                 onChange={handleProfilePictureChange}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//             </div>
//           </div>
//           <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-gray-700 font-semibold"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={editedUser.name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 font-semibold"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={editedUser.email}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="phone"
//                 className="block text-gray-700 font-semibold"
//               >
//                 Phone
//               </label>
//               <input
//                 type="text"
//                 id="phone"
//                 name="phone"
//                 value={editedUser.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="address"
//                 className="block text-gray-700 font-semibold"
//               >
//                 Address
//               </label>
//               <textarea
//                 id="address"
//                 name="address"
//                 value={editedUser.address}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border rounded-lg"
//                 rows={3}
//               />
//             </div>
//             <div className="flex justify-start">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(true)}
//                 className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-900 transition"
//               >
//                 Update Info
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 w-96">
//             <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
//             <p className="mb-6">Do you really want to update your profile info?</p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveChanges}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProfilePage = () => {
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
  });

  const [editedUser, setEditedUser] = useState({ ...user });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) {
      setUser({
        userId: storedUserData._id,
        name: storedUserData.name,
        email: storedUserData.email,
        phone: storedUserData.phoneNo,
        address: storedUserData.address,
        profilePicture: storedUserData.avatar?.url || "/images/signup.jpg",
      });
      setEditedUser({
        userId: storedUserData._id,
        name: storedUserData.name,
        email: storedUserData.email,
        phone: storedUserData.phoneNo,
        address: storedUserData.address,
        profilePicture: storedUserData.avatar?.url || "/images/signup.jpg",
      });
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{12}$/, "Phone number must be exactly 12 digits")
      .required("Phone number is required"),
    address: Yup.string().min(5, "Address must be at least 5 characters").required("Address is required"),
  });

  const handleProfilePictureChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedUser({ ...editedUser, profilePicture: reader.result });
        setFieldValue("profilePicture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("userId", user.userId);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phoneNo", values.phone);
      formData.append("address", values.address);

      if (values.profilePicture.startsWith("data:image")) {
        const blob = await fetch(values.profilePicture).then((res) => res.blob());
        formData.append("profilePicture", blob, "profilePicture.png");
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setShowModal(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      <div className="relative w-full h-80 mb-8">
        <div className="absolute inset-0">
          <img
            src={"/images/welcome1.png"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute left-8 top-48 w-44 h-44 bg-gray-300 rounded-full overflow-hidden border-4 border-white">
          {editedUser.profilePicture ? (
            <img
              src={editedUser.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-slate-700">
              {user.name.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <div className="container mx-auto p-8 mt-8">
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="flex-1">
               <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
               <p className="text-gray-600">{user.email}</p>
             </div>
          <Formik
            initialValues={{
              name: editedUser.name,
              email: editedUser.email,
              phone: editedUser.phone,
              address: editedUser.address,
              profilePicture: editedUser.profilePicture,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              setShowModal(true);
              actions.setSubmitting(false); // Stop the submission for now
            }}
            enableReinitialize={true}
          >
            {({ setFieldValue, values }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-semibold">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-semibold">
                    Phone
                  </label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 font-semibold">
                    Address
                  </label>
                  <Field
                    as="textarea"
                    id="address"
                    name="address"
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label
                    htmlFor="profilePicture"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Update Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={(e) => handleProfilePictureChange(e, setFieldValue)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-900 transition"
                  >
                    Update Info
                  </button>
                </div>
                {showModal && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-96">
                      <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
                      <p className="mb-6">Do you really want to update your profile info?</p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            saveChanges(values, { setSubmitting: () => {} });
                            setShowModal(false);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
