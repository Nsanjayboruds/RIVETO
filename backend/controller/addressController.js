import User from "../model/userModel.js";
import logger from "../config/logger.js";

const MAX_ADDRESSES = 5;

// GET /api/user/address
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.addresses);
  } catch (error) {
    logger.error("getAddresses error", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/user/address
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.addresses.length >= MAX_ADDRESSES) {
      return res.status(400).json({
        message: `You can save a maximum of ${MAX_ADDRESSES} addresses`,
      });
    }

    const { fullName, phone, street, city, state, pincode, country, isDefault } = req.body;

    // If this address is marked default, unset any existing default
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    // If this is the first address, make it default automatically
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({ fullName, phone, street, city, state, pincode, country, isDefault: shouldBeDefault });
    await user.save();

    return res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error("addAddress error", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/address/:addressId
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const { fullName, phone, street, city, state, pincode, country, isDefault } = req.body;

    // If setting this as default, unset others
    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    address.fullName = fullName ?? address.fullName;
    address.phone = phone ?? address.phone;
    address.street = street ?? address.street;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.country = country ?? address.country;
    address.isDefault = isDefault ?? address.isDefault;

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error("updateAddress error", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/user/address/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was the default and others exist, make first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error("deleteAddress error", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/user/address/:addressId/default
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    user.addresses.forEach((addr) => { addr.isDefault = false; });
    address.isDefault = true;

    await user.save();

    return res.status(200).json({
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    logger.error("setDefaultAddress error", { error: error.message });
    return res.status(500).json({ message: "Server error" });
  }
};
