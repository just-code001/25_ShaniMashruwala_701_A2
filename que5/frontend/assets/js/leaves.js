async function loadLeaves(){
  const res = await fetch(API_BASE + '/leaves', { headers: authHeaders() });
  const list = await res.json();
  const rows = list.map(l => `<tr>
    <td>${new Date(l.date).toLocaleDateString()}</td>
    <td>${l.reason}</td>
    <td>${l.granted ? 'Yes' : 'No'}</td>
    <td>${new Date(l.createdAt).toLocaleString()}</td>
  </tr>`).join('');
  $('#leavesTable tbody').html(rows || '<tr><td colspan="4">No leave records</td></tr>');
}

$('#leaveForm').on('submit', async function(e){
  e.preventDefault();
  const body = {
    date: $('#date').val(),
    reason: $('#reason').val().trim(),
    granted: $('#granted').val()
  };
  const res = await fetch(API_BASE + '/leaves', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  });
  if(res.ok){
    $('#reason').val('');
    $('#date').val('');
    await loadLeaves();
    alert('Leave submitted');
  }else{
    const j = await res.json();
    alert(j.message || 'Failed to submit');
  }
});

$(async function(){
  await loadLeaves();
});
