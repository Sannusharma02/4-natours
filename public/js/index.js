import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

// Dom Elements
const mapBox = document.getElementById('map');
const loginForm =document.querySelector('.form')
const email = document.getElementById('email');
const password = document.getElementById('password');

if(mapBox){
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if(loginForm){
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    login( email, password );
  });
}
