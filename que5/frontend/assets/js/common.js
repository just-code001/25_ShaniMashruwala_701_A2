const API_BASE = 'http://localhost:4000/api';

function getToken(){ return localStorage.getItem('token'); }
function setToken(t){ localStorage.setItem('token', t); }
function clearToken(){ localStorage.removeItem('token'); }

// Protect pages: redirect to login if no token
$(function(){
  const isProtected = window.location.pathname.endsWith('profile.html') || window.location.pathname.endsWith('leaves.html');
  if(isProtected && !getToken()){
    window.location.href = 'index.html';
  }
  $('#logoutBtn').on('click', function(){
    clearToken();
    window.location.href = 'index.html';
  });
});

function authHeaders(){
  return { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' };
}
