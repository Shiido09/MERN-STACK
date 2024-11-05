import React, { useState } from 'react';
import Modal from './Modal';
import BlogForm from './BlogForm';

const Blogs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Blogs</h2>
      <button onClick={toggleModal} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Add Blog
      </button>
      <Modal isOpen={isOpen} onClose={toggleModal} title="Add Blog">
        <BlogForm />
      </Modal>
      {/* Add DataTable for Blogs here */}
    </div>
  );
};

export default Blogs;
