/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    console.log("3",email, password);
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/users/login`,
      data: {
        email,
        password
      }
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload();
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

