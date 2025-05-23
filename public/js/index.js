import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login,logout } from './login';
import { updateSettings } from './updateSettings';

// Dom Elements
const mapBox = document.getElementById('map');
// const loginForm = document.querySelector('.form--login');
const loginForm = document.getElementById('loginForm');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}


if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const  form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value)
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form,'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.getElementById('password-current').textContent = '';
    document.getElementById('password').textContent = '';
    document.getElementById('password-confirm').textContent = '';
  });

