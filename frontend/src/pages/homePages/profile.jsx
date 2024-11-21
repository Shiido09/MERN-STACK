import React, { useState } from "react";
import Header from "./Header"; // Assuming you have a Header component

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123456789",
    address: "123 Main St, Springfield, USA",
    profilePicture: '/images/signup.jpg',
    coverPhoto: '/images/welcome1.png',
  });

  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedUser({ ...editedUser, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes after confirmation
  const saveChanges = () => {
    setUser({ ...editedUser });
    setIsEditing(false);
    setShowModal(false);
    alert("Profile updated successfully!");
  };

  // Cancel changes
  const cancelChanges = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <div className="bg-stone-300 min-h-screen">
      <Header />
      
      {/* Cover Photo Section */}
      <div className="relative w-full h-80 mb-8">
        <div className="absolute inset-0">
          <img
            src={editedUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Profile Picture Overlay */}
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

      {/* Profile Info Section */}
      <div className="container mx-auto p-8 mt-8">
        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            {/* Name */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Update Profile Picture Button */}
            <div className="mr-[588px] ">
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
                onChange={handleProfilePictureChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-semibold"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-semibold"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={editedUser.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            {/* Update Info Button */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-900 transition"
              >
                Update Info
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you really want to update your profile info?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelChanges}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
