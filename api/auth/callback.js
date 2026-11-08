export default async function handler(req, res) {
  const { code, state } = req.query;

  // 1. Verify 'state' matches what you originally sent to prevent CSRF
  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    // Retrieve the code_verifier stored in the user's session/cookie
    const codeVerifier = req.cookies.code_verifier; 

    // 2. Exchange the code for tokens
    const response = await fetch('https://api.youversion.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.YOUVERSION_CLIENT_ID,
        client_secret: process.env.YOUVERSION_CLIENT_SECRET, // If required by your client type
        code: code,
        redirect_uri: process.env.YOUVERSION_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // 3. Process the returned tokens
    // data.id_token contains user identity info (yvp_id, email, name)
    // data.access_token is used for calling YouVersion API endpoints
    
    // Securely establish your own user session here using the verified ID token
    
    // Redirect user back to your dashboard or frontend home
    res.writeHead(302, { Location: '/dashboard' });
    res.end();

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}