const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

let storedNumbers = [];

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  const validIds = ["primes", "fibo", "even", "rand"];
  if (!validIds.includes(numberid)) {
    return res.status(400).json({ error: "Invalid numberid" });
  }

  const apiURL = `http://20.244.56.144/evaluation-service/${numberid}`;

  const windowPrevState = [...storedNumbers];
  let newNumbers = [];

  try {
    const response = await axios.get(apiURL, { timeout: 500 });
    newNumbers = response.data.numbers || [];
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch numbers or timed out" });
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
    storedNumbers.reduce((sum, num) => sum + num, 0) / storedNumbers.length;

  res.json({
    windowPrevState,
    windowCurrState: storedNumbers,
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
