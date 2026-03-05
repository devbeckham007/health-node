const Medicine = require("../model/medicineModel");

const createMedicine = async (req, res) => {
    try{
        if(req.user.role !== "doctor" && req.user.role !== "pharmacist"){
        return res.status(403).json({ error: "Unauthorized" });
        }
    const{ name, description, price, stock } = req.body;
    if(!name || !description || !price || !stock){
        return res.status(400).json({ error: "All fields are required" });
    }
    const newMedicine =new Medicine({ name, description, price, stock });
    await newMedicine.save();
    res.status(201).json({ message: "Medicine created successfully", medicine: newMedicine });
}
    catch(error){
        console.error("Error creating medicine:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const readMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.render("medicines", { medicines, username: req.user.username });
    // or res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
const updateMedicine = async (req, res) => {
  try {
    if (req.user.role !== "doctor" && req.user.role !== "pharmacist") {
      return res.status(403).send("Access denied"); // ✅ return stops here
    }

   const { id } = req.params; // medicine ID from route
    const { name, description, price, stock } = req.body;

    // Update medicine by ID
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { name, description, price, stock },
      { new: true } // return updated document
    );

    if (!updatedMedicine) {
      return res.status(404).send("Medicine not found");
    }
    return res.redirect("/medicines"); // ✅ only one response
  } catch (error) {
    console.error("Error adding medicine:", error);
    return res.status(500).send("Server error"); // ✅ return here too
  }
};
const deleteMedicine = async (req, res) => {
    try{
        if(req.user.role !== "doctor" && req.user.role !== "pharmacist"){
        return res.status(403).json({ error: "Unauthorized" });
        }
        const {id}= req.params;
        const medicine = await Medicine.findByIdAndDelete(id);

        if(!medicine){
            return res.status(404).json({ error: "Medicine not found" });
        }
        res.redirect("/medicines");
    } catch(error){
        console.error("Error deleting medicine:", error);
        res.status(500).json({ error: "Server error" });
    }};

module.exports = { createMedicine, readMedicines, updateMedicine, deleteMedicine };