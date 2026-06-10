import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Droplets, Calendar,
  MapPin, ShieldCheck, Save, CheckCircle2, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name:       '',
    age:        '',
    bloodGroup: '',
    phone:      '',
    gender:     '',
    address:    '',
  });
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  /* seed form from persisted user */
  useEffect(() => {
    if (user) {
      setForm({
        name:       user.name       || '',
        age:        user.age        || '',
        bloodGroup: user.bloodGroup || '',
        phone:      user.phone      || '',
        gender:     user.gender     || '',
        address:    user.address    || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const cardVariant = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="profile-root page-container">

      {/* Header */}
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-avatar">
          <User size={34} />
        </div>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>
            <ShieldCheck size={13} />
            Personal Health Record
          </div>
          <h1 className="profile-title">{form.name || 'Your Profile'}</h1>
          <p className="profile-email">
            <Mail size={13} style={{ marginRight: 4, opacity: 0.6 }} />
            {user?.email}
          </p>
        </div>
        <button
          className={`profile-edit-btn ${editing ? 'active' : ''}`}
          onClick={() => setEditing(e => !e)}
          type="button"
        >
          <Edit3 size={15} />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </motion.div>

      <form onSubmit={handleSave}>
        <motion.div
          className="profile-grid"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >

          {/* Full Name */}
          <motion.div className="profile-field card" variants={cardVariant}>
            <label className="field-label">
              <User size={14} /> Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className="field-input"
              placeholder="Enter your full name"
            />
          </motion.div>

          {/* Age */}
          <motion.div className="profile-field card" variants={cardVariant}>
            <label className="field-label">
              <Calendar size={14} /> Age
            </label>
            <input
              name="age"
              type="number"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              disabled={!editing}
              className="field-input"
              placeholder="Enter your age"
            />
          </motion.div>

          {/* Blood Group */}
          <motion.div className="profile-field card" variants={cardVariant}>
            <label className="field-label">
              <Droplets size={14} /> Blood Group
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              disabled={!editing}
              className="field-input field-select"
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </motion.div>

          {/* Gender */}
          <motion.div className="profile-field card" variants={cardVariant}>
            <label className="field-label">
              <User size={14} /> Gender
            </label>
            <div className="profile-radio-group">
              {GENDERS.map(g => (
                <button
                  key={g}
                  type="button"
                  className={`profile-radio-option ${form.gender === g ? 'profile-radio-option--selected' : ''}`}
                  onClick={() => editing && setForm(prev => ({ ...prev, gender: g }))}
                  disabled={!editing}
                >
                  {g}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div className="profile-field card" variants={cardVariant}>
            <label className="field-label">
              <Phone size={14} /> Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              disabled={!editing}
              className="field-input"
              placeholder="Enter your phone number"
            />
          </motion.div>

          {/* Address */}
          <motion.div className="profile-field card profile-field--wide" variants={cardVariant}>
            <label className="field-label">
              <MapPin size={14} /> Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!editing}
              className="field-input"
              placeholder="Enter your address"
            />
          </motion.div>

        </motion.div>

        {/* Save button — only visible in edit mode */}
        {editing && (
          <motion.div
            className="profile-save-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button type="submit" className="btn-primary profile-save-btn">
              <Save size={16} />
              Save Changes
            </button>
          </motion.div>
        )}
      </form>

      {/* Success toast */}
      {saved && (
        <motion.div
          className="profile-toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          Profile updated successfully!
        </motion.div>
      )}
    </div>
  );
}
