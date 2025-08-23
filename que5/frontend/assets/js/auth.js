$('#loginForm').on('submit', function(e){
  e.preventDefault();
  const email = $('#email').val().trim();
  const password = $('#password').val().trim();
  $('#msg').text('');
  $.ajax({
    url: 'http://localhost:4000/api/auth/login',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ email, password }),
    success: function(res){
      localStorage.setItem('token', res.token);
      window.location.href = 'profile.html';
    },
    error: function(xhr){
      $('#msg').text(xhr.responseJSON?.message || 'Login failed');
    }
  });
});
