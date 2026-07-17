const adminController = {};

import adminModel from "../models/admins.js";

adminController.getAdmin = async (req, res) => {
  try {
    const admins = await adminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
    const deleteAdmin = await adminModel.findByIdAndDelete(req.params.id);

    if (!deleteAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.updateAdmin = async (req, res) => {
  try {
    let {
      name,
      lastname,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    const updateAdmin = await adminModel.findByIdAndUpdate(req.params.id, {
      name,
      lastname,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    },
    {
        new: true
    });

    if (!updateAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Admin updated" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminController;
