import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";


export default function SetAvatar() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setAvatarRouteUrl = 'http://localhost:5000/set-avatar';

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
  };

  const setProfilePicture = async () => {
    if (selectedImage === undefined) {
      toast.error("Please select an image", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
  
      const formData = new FormData();
      formData.append("avatar", selectedImage);
  
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
  
      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, formData, config);
  
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(user)
          );
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  return (
    <Container>
      <div className="title-container">
        <h1>Pick an image as your profile picture</h1>
      </div>
      <div className="image-upload">
        <label htmlFor="file-input">
          <img src={selectedImage || 'https://via.placeholder.com/150'} alt="avatar" />
        </label>
        <input type="file" id="file-input" accept="image/*" onChange={handleFileInputChange} />
      </div>
      <button onClick={setProfilePicture} className="submit-btn">
        Set as Profile Picture
      </button>
      <ToastContainer />
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
  padding: 2rem;

  .title-container {
    margin-bottom: 2rem;
  }

  .image-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    cursor: pointer;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
    }

    input {
      display: none;
    }
  }

  .submit-btn {
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    cursor: pointer;

    &:hover {
      background-color: #0d8bf2;
    }
  }
`;
