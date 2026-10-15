
import React, { useEffect, useState } from "react";
import "./Settings.css";

import {
  defaultProfile,
  defaultPreferences,
  defaultNotifications,
} from "../../../data";

const readSavedValue = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
};

const Settings = () => {
  const [profile, setProfile] = useState(() =>
    readSavedValue("shopstack_vendor_profile", defaultProfile)
  );

  const [preferences, setPreferences] = useState(() =>
    readSavedValue("shopstack_store_preferences", defaultPreferences)
  );

  const [notifications, setNotifications] = useState(() =>
    readSavedValue("shopstack_notifications", defaultNotifications)
  );

  const [saveMessage, setSaveMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Save preferences when they change.
  useEffect(() => {
    localStorage.setItem(
      "shopstack_store_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  // Save notification settings when they change.
  useEffect(() => {
    localStorage.setItem(
      "shopstack_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Update form fields while typing, without saving the profile yet.
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaveMessage("");
  };

  // Save the profile only when Save Changes is clicked.
  const handleSaveProfile = () => {
    localStorage.setItem(
      "shopstack_vendor_profile",
      JSON.stringify(profile)
    );

    // Notify VendorLayout to update the header after saving.
    window.dispatchEvent(new Event("vendorProfileUpdated"));

    setSaveMessage("Profile changes saved successfully.");

    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePreferenceChange = (name) => {
    setPreferences((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setPasswordMessage("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage(
        "New password and confirmation password do not match."
      );
      return;
    }

    // Demo only. A real password change requires a secure backend API.
    setPasswordMessage(
      "Password form validated. Backend integration is required."
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem("shopstack_vendor_session");
    alert("Logged out successfully!");
  };

  const ToggleRow = ({
    title,
    description,
    enabled,
    onClick,
    label,
  }) => (
    <div className="toggle-row">
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        className={`toggle ${enabled ? "on" : ""}`}
        onClick={onClick}
      >
        <span />
      </button>
    </div>
  );

  return (
    <div className="settings-page">
      <section className="settings-heading">
        <div>
          <p className="settings-label">VENDOR CONFIGURATION</p>
          <h2>Settings</h2>
          <p className="settings-description">
            Manage your store information, preferences, notifications and
            account.
          </p>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <p className="card-label">STORE INFORMATION</p>
            <h3>Store Profile</h3>
          </div>
          <span className="settings-icon">◇</span>
        </div>

        <div className="settings-form">
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={profile.storeName || ""}
              onChange={handleProfileChange}
              placeholder="Enter store name"
            />
          </div>

          <div className="form-group">
            <label>Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              value={profile.vendorName || ""}
              onChange={handleProfileChange}
              placeholder="Enter vendor name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleProfileChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ""}
              onChange={handleProfileChange}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="profile-actions">
          {saveMessage && (
            <span className="save-message">✓ {saveMessage}</span>
          )}

          <button
            type="button"
            className="save-button"
            onClick={handleSaveProfile}
          >
            Save Changes
          </button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <p className="card-label">STORE CONTROL</p>
            <h3>Store Preferences</h3>
          </div>
          <span className="settings-icon">⚙</span>
        </div>

        <div className="toggle-list">
          <ToggleRow
            title="Store Status"
            description="Keep your store available for customers."
            enabled={preferences.storeStatus}
            label="Toggle store status"
            onClick={() => handlePreferenceChange("storeStatus")}
          />

          <ToggleRow
            title="Order Notifications"
            description="Receive notifications when a new order is placed."
            enabled={preferences.orderNotifications}
            label="Toggle order notifications"
            onClick={() => handlePreferenceChange("orderNotifications")}
          />

          <ToggleRow
            title="Low Stock Alerts"
            description="Get notified when your products need restocking."
            enabled={preferences.lowStockAlerts}
            label="Toggle low stock alerts"
            onClick={() => handlePreferenceChange("lowStockAlerts")}
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <p className="card-label">ALERT PREFERENCES</p>
            <h3>Notifications</h3>
          </div>
          <span className="settings-icon">♢</span>
        </div>

        <div className="toggle-list">
          <ToggleRow
            title="New Orders"
            description="Get notified when a customer places a new order."
            enabled={notifications.newOrders}
            label="Toggle new order notifications"
            onClick={() => handleNotificationChange("newOrders")}
          />

          <ToggleRow
            title="Order Updates"
            description="Receive updates about order processing and shipping."
            enabled={notifications.orderUpdates}
            label="Toggle order updates"
            onClick={() => handleNotificationChange("orderUpdates")}
          />

          <ToggleRow
            title="Low Stock Alerts"
            description="Get notified when products need restocking."
            enabled={notifications.lowStock}
            label="Toggle low stock notifications"
            onClick={() => handleNotificationChange("lowStock")}
          />

          <ToggleRow
            title="Warehouse Updates"
            description="Receive updates about warehouse allocation and shipments."
            enabled={notifications.warehouseUpdates}
            label="Toggle warehouse notifications"
            onClick={() => handleNotificationChange("warehouseUpdates")}
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div>
            <p className="card-label">ACCOUNT MANAGEMENT</p>
            <h3>Account</h3>
          </div>
          <span className="settings-icon">◇</span>
        </div>

        <div className="account-row">
          <div>
            <h4>Change Password</h4>
            <p>Update your password to keep your account secure.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setPasswordMessage("");
              setShowPasswordModal(true);
            }}
          >
            Change Password
          </button>
        </div>

        <div className="account-row logout-row">
          <div>
            <h4>Logout</h4>
            <p>Sign out from your vendor account.</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>

      {showPasswordModal && (
        <div
          className="password-modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="password-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="password-modal-header">
              <div>
                <p>ACCOUNT SECURITY</p>
                <h3>Change Password</h3>
              </div>

              <button
                type="button"
                className="close-password-button"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>

            <form className="password-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {passwordMessage && (
                <p
                  className={`password-message ${
                    passwordMessage.includes("required") ||
                    passwordMessage.includes("match") ||
                    passwordMessage.includes("characters")
                      ? "error"
                      : "success"
                  }`}
                >
                  {passwordMessage}
                </p>
              )}

              <div className="password-actions">
                <button
                  type="button"
                  className="cancel-password-button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-password-button">
                  Validate Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;