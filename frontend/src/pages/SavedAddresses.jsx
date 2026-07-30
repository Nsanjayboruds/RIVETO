import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import apiConfig from '../utils/apiConfig';
import Title from '../components/Title';

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
};

function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await apiConfig.get('/user/address');
      setAddresses(res.data);
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters';

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) errors.phone = 'Enter a valid 10-digit phone number';

    if (!formData.street.trim()) errors.street = 'Street address is required';

    if (!formData.city.trim()) errors.city = 'City is required';

    if (!formData.state.trim()) errors.state = 'State is required';

    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!pincodeRegex.test(formData.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';

    if (!formData.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openAddForm = () => {
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setEditingId(address._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await apiConfig.put(`/user/address/${editingId}`, formData);
        toast.success('Address updated');
      } else {
        await apiConfig.post('/user/address', formData);
        toast.success('Address added');
      }
      await fetchAddresses();
      closeForm();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save address';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (addressId) => {
    if (
  !window.confirm(
    'Are you sure you want to delete this address?\n\nThis action cannot be undone.'
  )
)
  return;
    try {
      await apiConfig.delete(`/user/address/${addressId}`);
      toast.success('The address has been permanently deleted.');
      await fetchAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const onSetDefault = async (addressId) => {
    try {
      await apiConfig.patch(`/user/address/${addressId}/default`);
      toast.success('Default address updated');
      await fetchAddresses();
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Title text1={'SAVED'} text2={'ADDRESSES'} />
          <p className="text-cyan-100 mt-2">Manage your delivery addresses</p>
        </div>

        {/* Add Address Button */}
        {!showForm && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={openAddForm}
              disabled={addresses.length >= 5}
              title={addresses.length >= 5 ? 'Maximum 5 addresses allowed' : ''}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus />
              Add New Address
            </button>
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-cyan-400" />
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onChangeHandler}
                    placeholder="Full name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {formErrors.fullName && <p className="text-red-400 text-sm mt-1">{formErrors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChangeHandler}
                    placeholder="10-digit mobile number"
                    className={`${inputClass} pl-10`}
                    maxLength={10}
                  />
                </div>
                {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
              </div>

              {/* Street */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">Street Address</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={onChangeHandler}
                    placeholder="House no, building, street"
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {formErrors.street && <p className="text-red-400 text-sm mt-1">{formErrors.street}</p>}
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onChangeHandler}
                    placeholder="City"
                    className={inputClass}
                  />
                  {formErrors.city && <p className="text-red-400 text-sm mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={onChangeHandler}
                    placeholder="State"
                    className={inputClass}
                  />
                  {formErrors.state && <p className="text-red-400 text-sm mt-1">{formErrors.state}</p>}
                </div>
              </div>

              {/* Pincode + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={onChangeHandler}
                    placeholder="6-digit pincode"
                    className={inputClass}
                    maxLength={6}
                  />
                  {formErrors.pincode && <p className="text-red-400 text-sm mt-1">{formErrors.pincode}</p>}
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={onChangeHandler}
                    placeholder="Country"
                    className={inputClass}
                  />
                  {formErrors.country && <p className="text-red-400 text-sm mt-1">{formErrors.country}</p>}
                </div>
              </div>

              {/* Set as Default */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={onChangeHandler}
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-gray-300 text-sm">Set as default address</span>
              </label>

              {/* Form Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <FaMapMarkerAlt className="text-gray-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No saved addresses yet</p>
            <p className="text-gray-500 text-sm mt-1">Add an address to speed up checkout</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border p-6 transition-all ${
                  address.isDefault ? 'border-cyan-500/60' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full mb-2">
                        <FaCheckCircle className="text-xs" /> Default
                      </span>
                    )}
                    <p className="text-white font-semibold">{address.fullName}</p>
                    <p className="text-gray-400 text-sm mt-1">{address.street}</p>
                    <p className="text-gray-400 text-sm">
                      {address.city}, {address.state} — {address.pincode}
                    </p>
                    <p className="text-gray-400 text-sm">{address.country}</p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <FaPhone className="text-xs" /> {address.phone}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {!address.isDefault && (
                      <button
                        onClick={() => onSetDefault(address._id)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1.5 rounded-lg transition"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => openEditForm(address)}
                      className="text-xs text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition flex items-center gap-1 justify-center"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(address._id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition flex items-center gap-1 justify-center"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <p className="text-gray-500 text-xs text-center mt-6">
            {addresses.length}/5 addresses saved
          </p>
        )}
      </div>
    </div>
  );
}

export default SavedAddresses;
