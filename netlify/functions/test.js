/**
 * Simple test function to verify Netlify Dev is working
 */
export const handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      message: 'Function is working!',
      path: event.path,
      method: event.httpMethod,
    }),
  };
};

