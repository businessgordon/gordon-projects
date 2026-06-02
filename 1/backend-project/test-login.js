const fetch = global.fetch;

(async () => {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'SmartPark123' }),
    });
    const text = await response.text();
    console.log('STATUS', response.status);
    console.log('BODY', text);
  } catch (error) {
    console.error('ERR', error);
    process.exitCode = 1;
  }
})();
