import React from 'react';

const BrandForm = () => {
  return (
    <form>
      <div>
        <label htmlFor="brand_name">Brand Name</label>
        <input type="text" id="brand_name" required />
      </div>
      {/* Add fields for brand_images if needed */}
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default BrandForm;
