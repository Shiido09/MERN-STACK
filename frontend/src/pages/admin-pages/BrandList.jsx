import React, { useState } from 'react';
import Modal from './Modal';
import BrandForm from './BrandForm';

const Brands = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Brands</h2>
      <button onClick={toggleModal} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Add Brand
      </button>
      <Modal isOpen={isOpen} onClose={toggleModal} title="Add Brand">
        <BrandForm />
      </Modal>
      {/* Add DataTable for Brands here */}
    </div>
  );
};

export default Brands;
