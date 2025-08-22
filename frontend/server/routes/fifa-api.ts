import { RequestHandler } from "express";

// Use localhost for development, docker container name for production
const FIFA_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'http://django-backend:8000/api' 
  : 'http://localhost:8000/api';

export const handleFifaApiProxy: RequestHandler = async (req, res) => {
  try {
    // Extract the FIFA API path from the request path
    const fifaPath = req.originalUrl.replace(/^\/api\//, '');
    const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `${FIFA_API_BASE}/${fifaPath}${queryString ? `?${queryString}` : ''}`;

    console.log(`FIFA API Proxy: ${req.method} ${url}`);
    console.log(`Using API base: ${FIFA_API_BASE}`);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FIFA API error: ${response.status} ${response.statusText}`, errorText);
      return res.status(response.status).json({
        error: `FIFA API returned ${response.status}`,
        message: response.statusText,
        details: errorText,
        url: url
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('FIFA API proxy error:', error);
    res.status(500).json({
      error: 'Failed to connect to FIFA API',
      details: error instanceof Error ? error.message : 'Unknown error',
      note: `Please ensure the FIFA API server is running at ${FIFA_API_BASE}`,
      suggestion: 'Check if the Django backend is running on port 8000'
    });
  }
};
