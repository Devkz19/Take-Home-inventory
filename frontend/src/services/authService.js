import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const validateEmail = (email) => {
  return email.match(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  );
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      { withCredentials: true }
    );
    if (response.status === 201) {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return null;
  }
};

// ✅ Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData
    );
    if (response.status === 200) {
      toast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return null;
  }
};

// ✅ Logout User
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/users/logout`);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

// ✅ Forgot Password
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

// ✅ Reset Password
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/users/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

// ✅ Get Login Status
export const getLoginStatus = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

// ✅ Get User Profile
export const getUser = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

// ✅ Update Profile
export const updateUser = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/updateuser`,
      formData
    );
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};

// ✅ Change Password
export const changePassword = async (formData) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/changepassword`,
      formData
    );
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    return null;
  }
};
