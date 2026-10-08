const Footer = () => {
  const shopLinks = [
    "Mobiles",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
  ];

  const helpLinks = [
    "Track Order",
    "Shipping Information",
    "Returns & Refunds",
    "Customer Support",
    "FAQs",
  ];

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#211f1b",
        color: "#ffffff",
        fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
        marginTop: "20px",
      }}
    >
      {/* MAIN FOOTER */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "55px 40px 45px",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
          gap: "55px",
        }}
      >
        {/* BRAND */}
        <div>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "35px",
              fontWeight: "700",
              letterSpacing: "-2px",
              lineHeight: "1",
              marginBottom: "18px",
            }}
          >
            Shop<span style={{ color: "#b58243" }}>360</span>
          </div>

          <p
            style={{
              margin: 0,
              maxWidth: "330px",
              color: "#bdb6ad",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            Everything you need, all in one place. Discover quality products,
            great prices, and a simple shopping experience.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            {["f", "𝕏", "in", "◎"].map((icon) => (
              <div
                key={icon}
                style={{
                  width: "34px",
                  height: "34px",
                  border: "1px solid #5c554d",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: "15px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Shop
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "13px",
            }}
          >
            {shopLinks.map((link) => (
              <span
                key={link}
                style={{
                  color: "#bdb6ad",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* HELP */}
        <div>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: "15px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Help
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "13px",
            }}
          >
            {helpLinks.map((link) => (
              <span
                key={link}
                style={{
                  color: "#bdb6ad",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {link}
              </span>
            ))}
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3
            style={{
              margin: "0 0 12px",
              fontSize: "15px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            Stay in the loop
          </h3>

          <p
            style={{
              margin: "0 0 18px",
              color: "#bdb6ad",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            Get updates on new products, deals, and offers.
          </p>

          <div
            style={{
              display: "flex",
              width: "100%",
              height: "42px",
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: 1,
                minWidth: 0,
                border: "1px solid #5c554d",
                borderRight: "none",
                borderRadius: "6px 0 0 6px",
                outline: "none",
                backgroundColor: "#2a2723",
                color: "#ffffff",
                padding: "0 12px",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              style={{
                width: "78px",
                border: "none",
                borderRadius: "0 6px 6px 0",
                backgroundColor: "#b58243",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          borderTop: "1px solid #3c3833",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "18px 40px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <span
            style={{
              color: "#8f8981",
              fontSize: "11px",
            }}
          >
            © 2026 Shop360. All rights reserved.
          </span>

          <div
            style={{
              display: "flex",
              gap: "24px",
              color: "#8f8981",
              fontSize: "11px",
            }}
          >
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;