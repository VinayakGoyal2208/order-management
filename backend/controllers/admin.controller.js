import Vendor from "../models/Vendor.js";

/**
 * @desc    Get all pending vendor applications
 * @route   GET /api/admin/pending-vendors
 */
export const getPendingVendors = async (req, res) => {
  try {
    // Fetches only businesses waiting for the first-time approval
    const pending = await Vendor.find({ status: "pending", role: "vendor" }).select("-password");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Get all registered businesses (Active/Suspended/Pending)
 * @route   GET /api/admin/all-vendors
 */
export const getAllVendors = async (req, res) => {
  try {
    // This finds ALL vendors regardless of status
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Approve, Reject, or Suspend a Vendor
 * @route   PATCH /api/admin/vendor-status/:id
 */
export const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting "active", "suspended", or "pending"

  try {
    // 1. Validation for allowed status strings
    const allowedStatuses = ["active", "suspended", "pending"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status update requested." });
    }

    // 2. Security: Ensure we aren't modifying an Admin account through this route
    const target = await Vendor.findById(id);
    if (!target) return res.status(404).json({ msg: "Business entity not found" });
    
    if (target.role === "admin") {
      return res.status(403).json({ msg: "Admin accounts cannot be modified via this endpoint." });
    }

    // 3. Update the status
    target.status = status;
    await target.save();
    
    res.json({ 
      msg: `Business status successfully updated to ${status}`, 
      vendorId: id,
      newStatus: status 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};