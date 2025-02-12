import React, { useState, useEffect } from 'react';
import './profile.css';
import { useLogin } from '../context/LoginContext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Profile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    image: '',
    address: ['', '', '', '', ''] // initialize address as an array of empty strings
  });
  const [dataa, setDataa] = useState({});
  const [Login, setLogin] = useLogin();
  const [isEditable, setIsEditable] = useState(false); // new state to toggle edit mode

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (Login) {
        try {
          const response = await fetch('/profile');
          const data = await response.json();

          if (response.status === 200) {
            setProfileData({
              name: data.name,
              email: data.email,
              mobile: data.mobile,
              gender: data.gender,
              image: data.image,
              address: data.address
            });
            setDataa(data);
          } else if (response.status === 401) {
            setLogin(false);
          } else {
            console.log('Error');
            alert('An error has occurred');
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
    };
    fetchData();
  }, [Login]);

  const handleEdit = async() => {
    if (isEditable) {
      try{
        const response = await fetch('/profile',{
          method:'POST',
          headers:{"Content-Type": "application/json" },
          body:JSON.stringify({profileData})
          });
          const data = await response.json();

          if (response.status === 200) {
            toast.success("Updated successfully", { autoClose: 1000 });
          } else if (response.status === 401) {
            setLogin(false);
            toast.warning("Session Expired , Please Login again", { autoClose: 1000 });
          } else {
            console.log('Error');
            toast.error("An error occurred", {autoClose: 1000});
          }
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
      console.log('Saving updated profile data...');
      // After saving, toggle isEditable off
      setIsEditable(!isEditable);
    }
  

  const handleInputChange = (e, field) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: e.target.value
    }));
  };

  const handleAddressChange = (e, index) => {
    const newAddress = [...profileData.address];
    newAddress[index] = e.target.value;
    setProfileData((prevState) => ({
      ...prevState,
      address: newAddress
    }));
  };

  return (
    <div>
      {!Login && <h1>Login to view your profile</h1>}
      {Login && (
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            {/* Left side: Profile Image and Name */}
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  className="rounded-circle mt-5"
                  width="150px"
                  src={profileData.image}
                  alt="profile"
                />
                <span className="font-weight-bold mt-3">{profileData.name}</span>
              </div>
            </div>

            {/* Middle: Name, Mobile, Email, etc. */}
            <div className="col-md-4 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <h4 className="text-center">Profile Details</h4>
                </div>
                <div className="mb-3">
                  <label className="labels">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    readOnly={!isEditable} // readOnly when not in edit mode
                  />
                </div>
                <div className="mb-3">
                  <label className="labels">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    readOnly={!isEditable} // readOnly when not in edit mode
                  />
                </div>
                <div className="mb-3">
                  <label className="labels">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength={10}
                    minLength={10}
                    value={profileData.mobile}
                    onChange={(e) => handleInputChange(e, 'mobile')}
                    readOnly={!isEditable} // readOnly when not in edit mode
                  />
                </div>
                <label className="form-label" htmlFor="gender">
                  Gender:
                </label>
                <select
                  className="form-input"
                  name="gender"
                  id="gender"
                  value={profileData.gender}
                  onChange={(e) => handleInputChange(e, 'gender')}
                  disabled={!isEditable} // disabled when not in edit mode
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <br />
                <br />
                <div className="mt-5 text-center">
                  <button className="btn btn-primary profile-button" type="button" onClick={handleEdit}>
                    {isEditable ? 'Save' : 'Edit'} {/* Button text changes */}
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Address Fields */}
            <div className="col-md-5">
              <div className="p-3 py-5">
                <h4 className="text-center">Address Information</h4>
                {profileData.address.map((line, index) => (
                  <div className="mb-3" key={index}>
                    <label className="labels">Address Line {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={line}
                      onChange={(e) => handleAddressChange(e, index)}
                      readOnly={!isEditable} // readOnly when not in edit mode
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
