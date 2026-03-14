const payment = require("../model/payment");
const payStack = require("../utils/paystack"); // use this, not raw axios

const initializePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid email or amount" });
    //    console.log('invalid email or amount');
      
    }
    const response = await payStack.post("transaction/initialize", {
      email,
      amount: Math.floor(amount * 100) // ensure integer, no decimals
    });
    const authUrl = response.data.data.authorization_url;
    return res.redirect(authUrl); // ✅ redirect user straight to Paystack

    res.json(response.data);
  } catch (e) {
    console.error("Initialize error:", e.response?.data || e.message);
    res.status(500).json({ error: e.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const response = await payStack.get(`transaction/verify/${req.params.reference}`);
    const data = response.data.data;

    await payment.updateOne(
      { reference: data.reference },
      {
        email: data.customer.email,
        amount: data.amount / 100,
        status: data.status,
        date: new Date()
      },
      { upsert: true }
    );

    res.json({ message: "Payment saved successfully", data });
  } catch (e) {
    console.error("Verify error:", e.response?.data || e.message);
    res.status(500).json({ error: e.message });
  }
};

module.exports = { initializePayment, verifyPayment };