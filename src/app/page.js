'use client'
import React, { useState } from 'react';

export default function GenerateBucketPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    interests: '',
    location: '',
    budget: '',
    solo_or_social: '',
    transportation: '',
    travel_distance: '',
    availability: '',
    categories: '',
    limitations: '',
    extra_details: ''
  });

  const [bucketList, setBucketList] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/chat/generate-bucket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInfo })
      });

      
      const data = await response.json();
      // Log the response data for debugging
      console.log('API Response:', data);

      if (response.ok) {
        setBucketList(data.bucketList); // Store the generated bucket list
      } else {
        setError(data.error || 'An error occurred while generating the bucket list.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred while generating the bucket list.');
    }
  };

  return (
    <div>
      <h1>Generate Your Bucket List</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={userInfo.name} onChange={handleInputChange} />
        <br />

        <label>Interests:</label>
        <input type="text" name="interests" value={userInfo.interests} onChange={handleInputChange} />
        <br />

        <label>Location:</label>
        <input type="text" name="location" value={userInfo.location} onChange={handleInputChange} />
        <br />

        <label>Budget:</label>
        <input type="text" name="budget" value={userInfo.budget} onChange={handleInputChange} />
        <br />

        <label>Solo or Social:</label>
        <input type="text" name="solo_or_social" value={userInfo.solo_or_social} onChange={handleInputChange} />
        <br />

        <label>Transportation:</label>
        <input type="text" name="transportation" value={userInfo.transportation} onChange={handleInputChange} />
        <br />

        <label>Max Travel Distance:</label>
        <input type="text" name="travel_distance" value={userInfo.travel_distance} onChange={handleInputChange} />
        <br />

        <label>Available Times:</label>
        <input type="text" name="availability" value={userInfo.availability} onChange={handleInputChange} />
        <br />

        <label>Preferred Categories:</label>
        <input type="text" name="categories" value={userInfo.categories} onChange={handleInputChange} />
        <br />

        <label>Physical Limitations:</label>
        <input type="text" name="limitations" value={userInfo.limitations} onChange={handleInputChange} />
        <br />

        <label>Extra Info:</label>
        <input type="text" name="extra_details" value={userInfo.extra_details} onChange={handleInputChange} />
        <br />

        <button type="submit">Generate Bucket List</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {bucketList && (
        <div>
          <h2>Your Bucket List:</h2>
          <ul>
            {bucketList.map((activity, index) => (
              <li key={index}>
                <strong>{activity.name}</strong>: {activity.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
