import axios from 'axios';

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log("SUCCESS! Status Code:", res.status);
    console.log("Response Body:", res.data.name, res.data.email);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log("ERROR: Your backend server is not running! (ECONNREFUSED)");
    } else {
      console.log("FAILED!", err.response ? err.response.data : err.message);
    }
  }
}

testLogin();
