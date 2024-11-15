import React, { useState } from "react";
import axios from "axios";
// certificate and profile pic section not working yet have to see how to correct it 
function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    state: "",
    gender: "",
    age: "",
    dob: "",
    email: "",
    domain: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);
  const [retrievedState, setRetrievedState] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    if (e.target.name === "profilePic") {
      setProfilePic(e.target.files[0]);
    } else {
      setCertificateImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("profilePic", profilePic);
    data.append("certificateImage", certificateImage);

    try {
      await axios.post("http://localhost:5000/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Data submitted successfully!");
    } catch (error) {
      alert("Failed to submit data!");
    }
  };

  // Fetch user details by state right now its not working correctly ,it retrives all data in local db
  const fetchDetailsByState = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/users?state=${retrievedState}`);
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Profile Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Input fields */}
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
        <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
        <input name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
        <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
        <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
        <input name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="domain" value={formData.domain} onChange={handleChange} placeholder="Certificate Domain" required />

        {/* File inputs */}
        <input type="file" name="profilePic" onChange={handleFileChange} required />
        <input type="file" name="certificateImage" onChange={handleFileChange} required />

        <button type="submit">Submit</button>
      </form>

      <h2>Retrieve User Details by State</h2>
      <input
        type="text"
        placeholder="Enter state to retrieve details"
        value={retrievedState}
        onChange={(e) => setRetrievedState(e.target.value)}
      />
      <button onClick={fetchDetailsByState}>Retrieve</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <p>Name: {user.firstName} {user.lastName}</p>
                <p>Phone: {user.phoneNumber}</p>
                <p>State: {user.state}</p>
                <p>Age: {user.age}</p>
                <p>Email: {user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No users found for this state.</p>
        )}
      </div>
    </div>
  );
}

export default App;
