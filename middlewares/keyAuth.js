const Key = process.env.api_key

function apiAuthMiddleware(req, res, next) {
    // Extract the API key from the request headers, query parameters, or any other location
    let apiKey = req.headers['authorization']
    apiKey = apiKey.substring(7, apiKey.length);
   //console.log(apiKey)
   
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is missing.' });
    }
  
    // Check if the API key is valid
    if (apiKey === Key) {
      // If the key is valid, you can store it in the request object for further use
      //req.apiKey = apiKey;
      next(); // Continue with the next middleware or route handler
    } else {
      return res.status(403).json({ error: 'Invalid API key.' });
    }
  }
  
  module.exports = apiAuthMiddleware; 