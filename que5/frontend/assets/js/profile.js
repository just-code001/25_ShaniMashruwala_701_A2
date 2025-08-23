$(async function(){
  try{
    const res = await fetch(API_BASE + '/me', { headers: authHeaders() });
    if(!res.ok){ throw new Error('Not authorized'); }
    const emp = await res.json();
    $('#profile').html(`
      <p><b>Employee ID:</b> ${emp.empid}</p>
      <p><b>Name:</b> ${emp.name}</p>
      <p><b>Email:</b> ${emp.email}</p>
      <p><b>Department:</b> ${emp.department}</p>
      <p><b>Title:</b> ${emp.title}</p>
      <p><b>Join Date:</b> ${new Date(emp.joinDate).toLocaleDateString()}</p>
    `);
  }catch(err){
    alert('Session expired. Please login again.');
    clearToken();
    window.location.href = 'index.html';
  }
});