<script>
  import { onMount } from 'svelte';

  let message = 'Loading...';
  let status = 'Connecting to backend...';
  let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  async function fetchData() {
    try {
      const response = await fetch(`${apiUrl}/api/hello`);
      const data = await response.json();
      message = data.message;
      
      const healthResponse = await fetch(`${apiUrl}/api/health`);
      const healthData = await healthResponse.json();
      status = healthData.message;
    } catch (error) {
      message = 'Failed to connect to backend';
      status = 'Error: ' + error.message;
      console.error('Error fetching data:', error);
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

<main>
  <div class="container">
    <h1>🌟 Viveris Carbone</h1>
    <p class="subtitle">FastAPI + Svelte Starter Project</p>
    
    <div class="card">
      <h2>Backend Status</h2>
      <p class="status">{status}</p>
    </div>

    <div class="card">
      <h2>API Response</h2>
      <p class="message">{message}</p>
    </div>

    <div class="info">
      <p>✅ FastAPI backend running</p>
      <p>✅ Svelte frontend connected</p>
      <p>✅ Docker containerization ready</p>
    </div>

    <button on:click={fetchData} class="btn">Refresh</button>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    max-width: 600px;
    width: 100%;
    text-align: center;
  }

  h1 {
    color: white;
    font-size: 3em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2em;
    margin-bottom: 30px;
  }

  .card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .card h2 {
    color: #667eea;
    margin-top: 0;
    font-size: 1.5em;
  }

  .status, .message {
    color: #333;
    font-size: 1.1em;
    margin: 10px 0;
  }

  .info {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
  }

  .info p {
    color: white;
    margin: 10px 0;
    font-size: 1.1em;
  }

  .btn {
    background: white;
    color: #667eea;
    border: none;
    padding: 15px 40px;
    font-size: 1.1em;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    font-weight: bold;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.3);
  }

  .btn:active {
    transform: translateY(0);
  }
</style>
