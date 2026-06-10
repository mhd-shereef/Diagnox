export const mapEndpoints = (schema, baseUrl) => {
  const paths = schema.paths || {};
  const mapped = [];

  const predictionKeywords = ['heart', 'cardio', 'cardiovascular', 'breast', 'cancer', 'tumor', 'diabetes', 'glucose'];

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, details] of Object.entries(methods)) {
      // Look for prediction routes
      const isPredictionRoute = predictionKeywords.some(kw => path.toLowerCase().includes(kw));
      
      if (isPredictionRoute && method === 'post') {
        const routeInfo = {
          id: path.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, ''),
          path: path,
          fullUrl: `${baseUrl}${path}`,
          method: method,
          summary: details.summary || path,
          tags: details.tags || [],
          schemaRef: null,
          requestSchema: null,
        };

        // Try to find the request body schema
        if (details.requestBody && details.requestBody.content && details.requestBody.content['application/json']) {
          const schemaRef = details.requestBody.content['application/json'].schema.$ref;
          if (schemaRef) {
            routeInfo.schemaRef = schemaRef;
            // The schemaRef usually looks like "#/components/schemas/CardioFeatures"
            const schemaName = schemaRef.split('/').pop();
            if (schema.components && schema.components.schemas && schema.components.schemas[schemaName]) {
              routeInfo.requestSchema = schema.components.schemas[schemaName];
            }
          }
        }
        
        mapped.push(routeInfo);
      }
    }
  }

  return mapped;
};
