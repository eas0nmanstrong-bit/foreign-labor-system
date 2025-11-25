const API_URL = 'http://localhost:3000/api';

const debugApi = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Fetch Clients
        console.log('Fetching clients...');
        const clientsRes = await fetch(`${API_URL}/clients`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!clientsRes.ok) throw new Error(`Fetch clients failed: ${clientsRes.statusText}`);
        const clientsData = await clientsRes.json();

        console.log('Clients fetched successfully.');
        console.log('Count:', clientsData.length);
        if (clientsData.length > 0) {
            console.log('First client:', clientsData[0]);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

debugApi();
