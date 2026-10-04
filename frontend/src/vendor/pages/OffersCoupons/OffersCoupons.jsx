import React, { useEffect, useMemo, useState } from "react";
import "./OffersCoupons.css";

const initialCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    used: 42,
    minimumOrder: 500,
    maximumDiscount: 500,
    usageLimit: 100,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
  },
  {
    id: 2,
    code: "FESTIVE500",
    type: "Flat Discount",
    value: 500,
    used: 28,
    minimumOrder: 2000,
    maximumDiscount: 500,
    usageLimit: 100,
    startDate: "2026-09-15",
    endDate: "2026-11-30",
  },
  {
    id: 3,
    code: "NEWUSER20",
    type: "Percentage",
    value: 20,
    used: 16,
    minimumOrder: 1000,
    maximumDiscount: 1000,
    usageLimit: 100,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
  },
];

const emptyForm = {
  code: "",
  type: "Percentage",
  value: "",
  minimumOrder: "",
  maximumDiscount: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
};

const OffersCoupons = () => {
  const [coupons, setCoupons] = useState(() => {
    const savedCoupons = localStorage.getItem("shopstack_coupons");

    return savedCoupons
      ? JSON.parse(savedCoupons)
      : initialCoupons;
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const getStatus = (coupon) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(`${coupon.startDate}T00:00:00`);
    const end = new Date(`${coupon.endDate}T23:59:59`);

    if (today < start) {
      return "Scheduled";
    }

    if (today > end) {
      return "Expired";
    }

    if (
      coupon.usageLimit &&
      Number(coupon.used) >= Number(coupon.usageLimit)
    ) {
      return "Expired";
    }

    return "Active";
  };

  useEffect(() => {
    localStorage.setItem(
      "shopstack_coupons",
      JSON.stringify(coupons)
    );
  }, [coupons]);

  const activeCoupons = coupons.filter(
    (coupon) => getStatus(coupon) === "Active"
  ).length;

  const totalRedemptions = coupons.reduce(
    (total, coupon) => total + Number(coupon.used || 0),
    0
  );

  const discountGiven = coupons.reduce((total, coupon) => {
    return total + Number(coupon.value || 0) * Number(coupon.used || 0);
  }, 0);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const status = getStatus(coupon);

      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [coupons, search, filter]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleCreateCoupon = (event) => {
    event.preventDefault();

    if (!form.code.trim()) {
      alert("Please enter a coupon code.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Please select the coupon start and end date.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    const duplicate = coupons.some(
      (coupon) =>
        coupon.code.toLowerCase() ===
        form.code.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A coupon with this code already exists.");
      return;
    }

    const newCoupon = {
      id: Date.now(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      used: 0,
      minimumOrder: Number(form.minimumOrder || 0),
      maximumDiscount: Number(form.maximumDiscount || 0),
      usageLimit: Number(form.usageLimit || 0),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    setCoupons((previous) => [newCoupon, ...previous]);

    closeModal();
  };

  const deleteCoupon = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    setCoupons((previous) =>
      previous.filter((coupon) => coupon.id !== id)
    );
  };

  const formatValue = (coupon) => {
    if (coupon.type === "Percentage") {
      return `${coupon.value}%`;
    }

    return `₹${Number(coupon.value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="offers-page">

      {/* PAGE HEADING */}

      <div className="offers-heading">

        <div>
          <p className="offers-label">
            PROMOTIONS
          </p>

          <h2>
            Offers & Coupons
          </h2>

          <p className="offers-description">
            Create and manage discounts to attract customers
            and increase your store sales.
          </p>
        </div>

        <button
          className="create-button"
          onClick={openCreateModal}
        >
          + Create Coupon
        </button>

      </div>


      {/* SUMMARY CARDS */}

      <div className="coupon-stats">

        <div>
          <span>ACTIVE COUPONS</span>
          <strong>{activeCoupons}</strong>
        </div>

        <div>
          <span>TOTAL REDEMPTIONS</span>
          <strong>{totalRedemptions}</strong>
        </div>

        <div>
          <span>DISCOUNT GIVEN</span>
          <strong>
            ₹{discountGiven.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>


      {/* COUPON MANAGEMENT */}

      <section className="coupon-card">

        <div className="coupon-card-heading">

          <div>
            <p>COUPON MANAGEMENT</p>
            <h3>Your Coupons</h3>
          </div>

          <div className="coupon-actions">

            <input
              type="text"
              className="coupon-search"
              placeholder="Search coupon..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="filter-button"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option value="All">All Coupons</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Expired">Expired</option>
            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="coupon-table">

          <div className="coupon-table-header">

            <span>COUPON CODE</span>
            <span>TYPE</span>
            <span>VALUE</span>
            <span>USED</span>
            <span>STATUS</span>
            <span>ACTION</span>

          </div>


          {filteredCoupons.length === 0 ? (

            <div className="empty-coupons">
              <div className="empty-icon">%</div>

              <h4>
                No coupons found
              </h4>

              <p>
                Create a new coupon to start offering
                discounts to your customers.
              </p>

              <button
                className="empty-create-button"
                onClick={openCreateModal}
              >
                + Create Coupon
              </button>
            </div>

          ) : (

            filteredCoupons.map((coupon) => {

              const status = getStatus(coupon);

              return (
                <div
                  className="coupon-row"
                  key={coupon.id}
                >

                  <strong>
                    {coupon.code}
                  </strong>

                  <span>
                    {coupon.type}
                  </span>

                  <strong>
                    {formatValue(coupon)}
                  </strong>

                  <span>
                    {coupon.used}
                    {coupon.usageLimit
                      ? ` / ${coupon.usageLimit}`
                      : ""}
                  </span>

                  <span
                    className={`coupon-status ${status.toLowerCase()}`}
                  >
                    {status}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteCoupon(coupon.id)
                    }
                    title="Delete coupon"
                  >
                    Delete
                  </button>

                </div>
              );
            })

          )}

        </div>

      </section>


      {/* CREATE COUPON MODAL */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="coupon-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <p>
                  NEW PROMOTION
                </p>

                <h3>
                  Create Coupon
                </h3>
              </div>

              <button
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              className="coupon-form"
              onSubmit={handleCreateCoupon}
            >

              {/* CODE */}

              <div className="form-group full-width">

                <label>
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleInputChange}
                  placeholder="Example: SAVE20"
                  maxLength={20}
                  required
                />

                <small>
                  Customers will enter this code at checkout.
                </small>

              </div>


              {/* TYPE */}

              <div className="form-group">

                <label>
                  Discount Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                >
                  <option value="Percentage">
                    Percentage
                  </option>

                  <option value="Flat Discount">
                    Flat Discount
                  </option>
                </select>

              </div>


              {/* VALUE */}

              <div className="form-group">

                <label>
                  Discount Value
                </label>

                <input
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleInputChange}
                  placeholder={
                    form.type === "Percentage"
                      ? "Example: 20"
                      : "Example: 500"
                  }
                  min="1"
                  required
                />

              </div>


              {/* MINIMUM ORDER */}

              <div className="form-group">

                <label>
                  Minimum Order
                </label>

                <div className="input-with-symbol">

                  <span>₹</span>

                  <input
                    type="number"
                    name="minimumOrder"
                    value={form.minimumOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />

                </div>

              </div>


              {/* MAXIMUM DISCOUNT */}

              <div className="form-group">

                <label>
                  Maximum Discount
                </label>

                <div className="input-with-symbol">

                  <span>₹</span>

                  <input
                    type="number"
                    name="maximumDiscount"
                    value={form.maximumDiscount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />

                </div>

              </div>


              {/* USAGE LIMIT */}

              <div className="form-group">

                <label>
                  Usage Limit
                </label>

                <input
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleInputChange}
                  placeholder="Example: 100"
                  min="1"
                />

              </div>


              {/* START DATE */}

              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  required
                />

              </div>


              {/* END DATE */}

              <div className="form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInputChange}
                  required
                />

              </div>


              {/* FORM ACTIONS */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  Create Coupon
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default OffersCoupons;