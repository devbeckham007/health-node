const axios = require('axios');


async function searchMedicine(name) {
  try {
    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(name)}&limit=1`
    );

    if (!response.data.results || response.data.results.length === 0) {
      return null;
    }

    const drug = response.data.results[0];
    return {
      name: drug.openfda?.brand_name?.[0] || "Unknown",
      generic_name: drug.openfda?.generic_name?.[0] || "Unknown",
      manufacturer: drug.openfda?.manufacturer_name?.[0] || "Unknown",
      purpose: drug.purpose?.[0] || "Not listed",
      warnings: drug.warnings?.[0] || "Not listed",
      dosage: drug.dosage_and_administration?.[0] || "Not listed"
    };
  } catch (error) {
    console.error("Error in searchMedicine:", error.message);
    return null;
  }
}


async function lookupMedicine(name) {
  try {
    if (!name || typeof name !== "string") {
      throw new Error("Invalid drug name provided");
    }

    const queryName = name.toUpperCase();
    let ndcDrug = null;

    // Try brand_name
    let ndcResponse = await axios.get(
      `https://api.fda.gov/drug/ndc.json?search=brand_name:${encodeURIComponent(queryName)}&limit=1`
    );
    ndcDrug = ndcResponse.data.results?.[0];

    // Fallback: generic_name
    if (!ndcDrug) {
      ndcResponse = await axios.get(
        `https://api.fda.gov/drug/ndc.json?search=generic_name:${encodeURIComponent(queryName)}&limit=1`
      );
      ndcDrug = ndcResponse.data.results?.[0];
    }

    // ✅ Only return the fields you want
    return {
      product_ndc: ndcDrug?.product_ndc || "Not listed",
      brand_name: ndcDrug?.brand_name || "Not listed",
      generic_name: ndcDrug?.generic_name || "Not listed",
      manufacturer: ndcDrug?.labeler_name || "Not listed",
      dosage: ndcDrug?.dosage_form || "Not listed",
      strength: ndcDrug?.active_ingredients?.map(ai => `${ai.name} ${ai.strength}`).join(", ") || "Not listed"
    };

  } catch (error) {
    console.error("Error in lookupMedicine:", error.message);
    return {
      product_ndc: "Not listed",
      brand_name: "Not listed",
      generic_name: "Not listed",
      manufacturer: "Not listed",
      dosage: "Not listed",
      strength: "Not listed"
    };
  }
}


module.exports = { searchMedicine, lookupMedicine };