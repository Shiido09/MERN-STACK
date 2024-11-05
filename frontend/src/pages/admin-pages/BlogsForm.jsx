import React from 'react';

const BlogForm = () => {
  return (
    <form>
      <div>
        <label htmlFor="event_name">Event Name</label>
        <input type="text" id="event_name" required />
      </div>
      <div>
        <label htmlFor="event_details">Event Details</label>
        <textarea id="event_details" required></textarea>
      </div>
      <div>
        <label htmlFor="event_date">Event Date</label>
        <input type="date" id="event_date" required />
      </div>
      {/* Add fields for event_images if needed */}
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default BlogForm;
