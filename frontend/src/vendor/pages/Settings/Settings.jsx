
import React, { useEffect, useState } from "react";
import "./Settings.css";

const defaultProfile = {
  storeName: "North & Form Store",
  vendorName: "Vendor",
  email: "vendor@shopstack.com",
  phone: "+91 98765 43210",
};

const defaultPreferences = {
  storeStatus: true,
  orderNotifications: true,
  lowStockAlerts: true,
};

const defaultNotifications = {
  newOrders: true,
  orderUpdates: true,
  lowStock: true,
  warehouseUpdates: true,
};

const Settings = () => {
  /* ================= PROFILE ================= */

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem(
      "shopstack_vendor_profile"
    );

    return savedProfile
      ? JSON.parse(savedProfile)
      : defaultProfile;
  });

  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem(
      "shopstack_store_preferences"
    );

    return savedPreferences
      ? JSON.parse(savedPreferences)
      : defaultPreferences;
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem(
      "shopstack_notifications"
    );

    return savedNotifications
      ? JSON.parse(savedNotifications)
      : defaultNotifications;
  });


  /* ================= UI STATES ================= */

  const [saveMessage, setSaveMessage] = useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] =
    useState("");


  /* ================= SAVE TO LOCAL STORAGE ================= */

  useEffect(() => {
    localStorage.setItem(
      "shopstack_vendor_profile",
      JSON.stringify(profile)
    );
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "shopstack_store_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(
      "shopstack_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);


  /* ================= PROFILE HANDLER ================= */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSaveProfile = () => {
    localStorage.setItem(
      "shopstack_vendor_profile",
      JSON.stringify(profile)
    );

    setSaveMessage("Profile changes saved successfully.");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };


  /* ================= PREFERENCE HANDLER ================= */

  const handlePreferenceChange = (name) => {
    setPreferences((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  /* ================= NOTIFICATION HANDLER ================= */

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };


  /* ================= PASSWORD ================= */

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
      setPasswordMessage(
        "Please fill in all password fields."
      );
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage(
        "New password and confirmation password do not match."
      );
      return;
    }

    /*
      Frontend demo only.

      In the real application this should be sent
      to your Spring Boot authentication API.
    */

    localStorage.setItem(
      "shopstack_vendor_password",
      passwordForm.newPassword
    );

    setPasswordMessage(
      "Password changed successfully!"
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordMessage("");
    }, 1500);
  };


  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    /*
      Frontend demo logout.

      Later this can clear the JWT/token
      and redirect to the login page.
    */

    localStorage.removeItem("shopstack_vendor_session");

    alert("Logged out successfully!");
  };


  return (
    <div className="settings-page">

      {/* ================= PAGE HEADER ================= */}

      <section className="settings-heading">

        <div>

          <p className="settings-label">
            VENDOR CONFIGURATION
          </p>

          <h2>
            Settings
          </h2>

          <p className="settings-description">
            Manage your store information, preferences,
            notifications and account.
          </p>

        </div>

      </section>


      {/* ================= STORE PROFILE ================= */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="card-label">
              STORE INFORMATION
            </p>

            <h3>
              Store Profile
            </h3>

          </div>

          <span className="settings-icon">
            ◇
          </span>

        </div>


        <div className="settings-form">

          <div className="form-group">

            <label>
              Store Name
            </label>

            <input
              type="text"
              name="storeName"
              value={profile.storeName}
              onChange={handleProfileChange}
              placeholder="Enter store name"
            />

          </div>


          <div className="form-group">

            <label>
              Vendor Name
            </label>

            <input
              type="text"
              name="vendorName"
              value={profile.vendorName}
              onChange={handleProfileChange}
              placeholder="Enter vendor name"
            />

          </div>


          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Enter email address"
            />

          </div>


          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="Enter phone number"
            />

          </div>

        </div>


        <div className="profile-actions">

          {saveMessage && (
            <span className="save-message">
              ✓ {saveMessage}
            </span>
          )}

          <button
            className="save-button"
            onClick={handleSaveProfile}
          >
            Save Changes
          </button>

        </div>

      </section>


      {/* ================= STORE PREFERENCES ================= */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="card-label">
              STORE CONTROL
            </p>

            <h3>
              Store Preferences
            </h3>

          </div>

          <span className="settings-icon">
            ⚙
          </span>

        </div>


        <div className="toggle-list">

          {/* STORE STATUS */}

          <div className="toggle-row">

            <div>

              <h4>
                Store Status
              </h4>

              <p>
                Keep your store available for customers.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle store status"
              className={`toggle ${
                preferences.storeStatus ? "on" : ""
              }`}
              onClick={() =>
                handlePreferenceChange("storeStatus")
              }
            >

              <span></span>

            </button>

          </div>


          {/* ORDER NOTIFICATIONS */}

          <div className="toggle-row">

            <div>

              <h4>
                Order Notifications
              </h4>

              <p>
                Receive notifications when a new order is placed.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle order notifications"
              className={`toggle ${
                preferences.orderNotifications
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  "orderNotifications"
                )
              }
            >

              <span></span>

            </button>

          </div>


          {/* LOW STOCK */}

          <div className="toggle-row">

            <div>

              <h4>
                Low Stock Alerts
              </h4>

              <p>
                Get notified when your products need restocking.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle low stock alerts"
              className={`toggle ${
                preferences.lowStockAlerts
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handlePreferenceChange(
                  "lowStockAlerts"
                )
              }
            >

              <span></span>

            </button>

          </div>

        </div>

      </section>


      {/* ================= NOTIFICATIONS ================= */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="card-label">
              ALERT PREFERENCES
            </p>

            <h3>
              Notifications
            </h3>

          </div>

          <span className="settings-icon">
            ♢
          </span>

        </div>


        <div className="toggle-list">

          {/* NEW ORDERS */}

          <div className="toggle-row">

            <div>

              <h4>
                New Orders
              </h4>

              <p>
                Get notified when a customer places a new order.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle new order notifications"
              className={`toggle ${
                notifications.newOrders
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handleNotificationChange(
                  "newOrders"
                )
              }
            >

              <span></span>

            </button>

          </div>


          {/* ORDER UPDATES */}

          <div className="toggle-row">

            <div>

              <h4>
                Order Updates
              </h4>

              <p>
                Receive updates about order processing and shipping.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle order updates"
              className={`toggle ${
                notifications.orderUpdates
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handleNotificationChange(
                  "orderUpdates"
                )
              }
            >

              <span></span>

            </button>

          </div>


          {/* LOW STOCK */}

          <div className="toggle-row">

            <div>

              <h4>
                Low Stock Alerts
              </h4>

              <p>
                Get notified when products need restocking.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle low stock notifications"
              className={`toggle ${
                notifications.lowStock
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handleNotificationChange(
                  "lowStock"
                )
              }
            >

              <span></span>

            </button>

          </div>


          {/* WAREHOUSE UPDATES */}

          <div className="toggle-row">

            <div>

              <h4>
                Warehouse Updates
              </h4>

              <p>
                Receive updates about warehouse allocation and shipments.
              </p>

            </div>

            <button
              type="button"
              aria-label="Toggle warehouse notifications"
              className={`toggle ${
                notifications.warehouseUpdates
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                handleNotificationChange(
                  "warehouseUpdates"
                )
              }
            >

              <span></span>

            </button>

          </div>

        </div>

      </section>


      {/* ================= ACCOUNT ================= */}

      <section className="settings-card">

        <div className="settings-card-heading">

          <div>

            <p className="card-label">
              ACCOUNT MANAGEMENT
            </p>

            <h3>
              Account
            </h3>

          </div>

          <span className="settings-icon">
            ◇
          </span>

        </div>


        {/* CHANGE PASSWORD */}

        <div className="account-row">

          <div>

            <h4>
              Change Password
            </h4>

            <p>
              Update your password to keep your account secure.
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={() =>
              setShowPasswordModal(true)
            }
          >
            Change Password
          </button>

        </div>


        {/* LOGOUT */}

        <div className="account-row logout-row">

          <div>

            <h4>
              Logout
            </h4>

            <p>
              Sign out from your vendor account.
            </p>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </section>


      {/* ================= PASSWORD MODAL ================= */}

      {showPasswordModal && (

        <div
          className="password-modal-overlay"
          onClick={() =>
            setShowPasswordModal(false)
          }
        >

          <div
            className="password-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="password-modal-header">

              <div>

                <p>
                  ACCOUNT SECURITY
                </p>

                <h3>
                  Change Password
                </h3>

              </div>

              <button
                className="close-password-button"
                onClick={() =>
                  setShowPasswordModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="password-form"
              onSubmit={handleChangePassword}
            >

              <div className="form-group">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={
                    passwordForm.currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter current password"
                />

              </div>


              <div className="form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordForm.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Enter new password"
                />

              </div>


              <div className="form-group">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={
                    passwordForm.confirmPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  placeholder="Confirm new password"
                />

              </div>


              {passwordMessage && (

                <p
                  className={`password-message ${
                    passwordMessage.includes(
                      "successfully"
                    )
                      ? "success"
                      : "error"
                  }`}
                >
                  {passwordMessage}
                </p>

              )}


              <div className="password-actions">

                <button
                  type="button"
                  className="cancel-password-button"
                  onClick={() =>
                    setShowPasswordModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-password-button"
                >
                  Update Password
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

