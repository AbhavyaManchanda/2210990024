 
const express = require("express");
const axios = require("axios");

 
const app = express();
const PORT = 9876;

 
const WINDOW_SIZE = 10;
let storedNumbers = [];

 
app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  
  const apiURL = `http://20.244.56.144/test/${numberid}`;
  let newNumbers = [];

  try {
    
    const response = await axios.get(apiURL, { timeout: 500 });
    newNumbers = response.data.numbers || [];
  } catch (error) {
    return res.status(500).json({ error: "API fetch failed or timed out" });
  }

   
  newNumbers.forEach((num) => {
    if (!storedNumbers.includes(num)) {
      storedNumbers.push(num);
    }
  });

   
  if (storedNumbers.length > WINDOW_SIZE) {
    storedNumbers = storedNumbers.slice(storedNumbers.length - WINDOW_SIZE);
  }

   
  const avg =
    storedNumbers.reduce((acc, val) => acc + val, 0) / storedNumbers.length;

   
  res.json({
    windowPrevState: [], 
    windowCurrState: storedNumbers,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

// Step 11: Server start karo
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
