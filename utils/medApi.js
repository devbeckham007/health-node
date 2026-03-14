const axios = require('axios');

async function searchMedicine(name) {
  try {
    const response = await axios.get(
      `https://api.goodrx.com/api/v2/drugs?name=${encodeURIComponent(name)}`,
      { headers: { Authorization: "Bearer YOUR_API_KEY" } }
    );

    // Return the first match
    const drug = response.data[0];
    if (!drug) return null;

    return drug; // includes id, name, etc.
  } catch (error) {
    console.error("Error in searchMedicine:", error.message);
    return null;
  }
}

async function lookupMedicine(drugId, zipCode = "90210") {
  try {
    const response = await axios.get(
      `https://api.goodrx.com/api/v2/prices?drug_id=${drugId}&location=${zipCode}`,
      { headers: { Authorization: "Bearer YOUR_API_KEY" } }
    );

    return response.data; // array of pharmacy prices
  } catch (error) {
    console.error("Error in lookupMedicine:", error.message);
    return null;
  }
}


module.exports = { searchMedicine, lookupMedicine };