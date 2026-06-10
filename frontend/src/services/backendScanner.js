import axios from 'axios';
import { mapEndpoints } from './apiMapper.js';

const DEFAULT_BACKEND_URL = 'http://localhost:10000';

export const scanBackend = async (url = DEFAULT_BACKEND_URL) => {
  try {
    const response = await axios.get(`${url}/openapi.json`);
    const schema = response.data;
    
    // We found OpenAPI schema, so it's likely FastAPI
    console.log("Detected FastAPI backend. OpenAPI schema loaded.");
    
    const endpoints = mapEndpoints(schema, url);
    return {
      success: true,
      framework: 'FastAPI',
      endpoints,
      rawSchema: schema,
    };
  } catch (error) {
    console.error("Failed to fetch OpenAPI schema:", error);
    return {
      success: false,
      framework: 'Unknown',
      endpoints: [],
      error: error.message
    };
  }
};
