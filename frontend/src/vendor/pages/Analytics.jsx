
import React, { useEffect, useMemo, useState } from "react";
import "./Analytics.css";

import {
  graphData,
  orderPerformance,
} from "../../data";

const API_URL = "http://localhost:8080/api/analytics/inventory";
const PRODUCTS_API_URL = "http://localhost:8080/api/products";

/* SALES GRAPH - EXISTING SAMPLE DATA */
function SalesGraph({ period }) {
  const data = graphData[period];

  const points = useMemo(() => {
    if (!data?.values?.length) return [];

    const width = 900;
    const height = 300;
    const maxValue = Math.max(...data.values);
    const graphMax = Math.ceil(maxValue / 1000) * 1000 || 1000;

    return data.values.map((value, index) => {
      const x =
        data.values.length === 1
          ? width / 2
          : (index / (data.values.length - 1)) * width;

      const y = height - (value / graphMax) * height;

      return { x, y, value };
    });
  }, [data]);

  const linePoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const areaPoints =
    points.length > 0 ? `0,300 ${linePoints} 900,300` : "";

  return (
    <div className="graph-container">
      <div className="y-axis">
        <span>₹6k</span>
        <span>₹4k</span>
        <span>₹2k</span>
        <span>₹0</span>
      </div>

      <div className="graph-area">
        <div className="grid-line line-1" />
        <div className="grid-line line-2" />
        <div className="grid-line line-3" />
        <div className="grid-line line-4" />

        <svg
          viewBox="0 0 900 330"
          preserveAspectRatio="none"
          className="sales-svg"
        >
          {points.length > 0 && (
            <>
              <polygon
                className="sales-area"
                points={areaPoints}
              />

              <polyline
                className="sales-line"
                points={linePoints}
              />

              {points.map((point, index) => (
                <circle
                  key={index}
                  className="graph-point"
                  cx={point.x}
                  cy={point.y}
                  r="5"
                />
              ))}
            </>
          )}
        </svg>

        <div className="x-axis">
          {data?.labels?.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ANALYTICS PAGE */
export default function Analytics() {
  const [period, setPeriod] = useState("30");

  // Backend inventory analytics state
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [products, setProducts] = useState([]);
const [productsError, setProductsError] = useState("");
  useEffect(() => {
  async function loadProducts() {
    try {
      const response = await fetch(PRODUCTS_API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
      setProductsError("");
    } catch (error) {
      console.error("Products API error:", error);
      setProductsError("Unable to load inventory products.");
    }
  }

  loadProducts();
}, []);


  // Fetch inventory summary from Spring Boot
  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Backend request failed: ${response.status}`
          );
        }

        const data = await response.json();

        setInventoryStats(data);
        setApiError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Analytics API error:", error);
          setApiError(
            "Unable to load inventory analytics. Please check the backend."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, []);

  return (
    <main className="main-content analytics-page">
      {/* PAGE TITLE */}
      <div className="analytics-title">
        <div>
          <h1>Analytics</h1>
          <p>Track your store performance</p>
        </div>
      </div>

      {/* INVENTORY SUMMARY - REAL BACKEND DATA */}
      <section className="analytics-box inventory-summary">
        <h2>Inventory Summary</h2>
        <div className="box-line" />

        {loading && <p>Loading inventory analytics...</p>}

        {apiError && (
          <div>
            <p role="alert">{apiError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !apiError && inventoryStats && (
          <div className="inventory-stats">
            <div className="inventory-stat-card">
              <span>Total Products</span>
              <strong>{inventoryStats.totalProducts ?? 0}</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Total Stock</span>
              <strong>{inventoryStats.totalStock ?? 0}</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Low Stock</span>
              <strong>{inventoryStats.lowStock ?? 0}</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Out of Stock</span>
              <strong>{inventoryStats.outOfStock ?? 0}</strong>
            </div>

            <div className="inventory-stat-card">
              <span>Inventory Value</span>
              <strong>
                ₹
                {Number(
                  inventoryStats.inventoryValue ?? 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        )}
      </section>

      {/* SALES OVERVIEW - CURRENTLY SAMPLE DATA */}
      <section className="sales-card">
        <div className="sales-header">
          <h2>Sales Overview</h2>

          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Sales period"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        <SalesGraph period={period} />
      </section>

      {/* ORDER PERFORMANCE - CURRENTLY SAMPLE DATA */}
      <div className="analytics-bottom">
        <section className="analytics-box">
          <h2>Order Performance</h2>
          <div className="box-line" />

          {orderPerformance.map((item) => (
            <div className="performance-item" key={item.label}>
              <div className="performance-heading">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>

              <div className="progress-background">
                <div
                  className={`progress ${item.label.toLowerCase()}`}
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* TOP PRODUCTS - CURRENTLY SAMPLE DATA */}
    
<section className="analytics-box">
  <h2>Top Selling Products</h2>
  <div className="box-line" />

  {productsError && <p role="alert">{productsError}</p>}

  {!productsError && products.length === 0 && (
    <p>No products available.</p>
  )}

  {products.map((product, index) => (
    <div
      className="selling-product"
      key={product.id ?? product.sku ?? index}
    >
      <span>
        <b>{index + 1}.</b> {product.name}
      </span>

      <strong>Stock: {product.stock ?? 0}</strong>
    </div>
  ))}
</section>

      </div>
    </main>
  );
}
