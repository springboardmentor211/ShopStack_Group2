
import "./Analytics.css";
import React, {
  useMemo,
  useState
} from "react";
import {
  graphData,
  topProducts,
  orderPerformance
} from "../../data";



/* GRAPH */

function SalesGraph({
  period
}) {

  const data =
    graphData[period];


  const points =
    useMemo(() => {

      const width = 900;

      const height = 300;

      const maxValue =
        Math.max(
          ...data.values
        );

      const graphMax =
        Math.ceil(
          maxValue / 1000
        ) * 1000;


      return data.values.map(
        (value, index) => {

          const x =
            (index /
              (data.values.length - 1)) *
            width;


          const y =
            height -
            (value / graphMax) *
              height;


          return {
            x,
            y,
            value
          };

        }
      );

    }, [data]);


  const linePoints =
    points
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ");


  const areaPoints =
    `0,300 ${linePoints} 900,300`;


  return (

    <div className="graph-container">


      <div className="y-axis">

        <span>
          ₹6k
        </span>

        <span>
          ₹4k
        </span>

        <span>
          ₹2k
        </span>

        <span>
          ₹0
        </span>

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


          <polygon
            className="sales-area"
            points={areaPoints}
          />


          <polyline
            className="sales-line"
            points={linePoints}
          />


          {points.map(
            (point, index) => (

              <circle
                key={index}
                className="graph-point"
                cx={point.x}
                cy={point.y}
                r="5"
              />

            )
          )}


        </svg>


        <div className="x-axis">

          {data.labels.map(
            (label) => (

              <span key={label}>
                {label}
              </span>

            )
          )}

        </div>


      </div>

    </div>

  );

}


export default function Analytics() {


  const [period, setPeriod] =
    useState("30");


  return (

    <main className="main-content analytics-page">


      {/* TITLE */}

      <div className="analytics-title">

        <div>

          <div className="page-label">
            PERFORMANCE ANALYTICS
          </div>

          <h1>
            Analytics
          </h1>

          <p>
            Monitor sales performance
            and understand your store's growth.
          </p>

        </div>


        <select
          value={period}
          onChange={(event) =>
            setPeriod(
              event.target.value
            )
          }
        >

          <option value="30">
            Last 30 Days
          </option>

          <option value="7">
            Last 7 Days
          </option>

          <option value="90">
            Last 90 Days
          </option>

        </select>

      </div>


      {/* SALES OVERVIEW */}

      <section className="sales-card">


        <div className="sales-card-header">

          <div>

            <h2>
              Sales Overview
            </h2>

            <p>
              Daily sales performance
              across the selected period.
            </p>

          </div>


          <div className="sales-legend">

            <span className="legend-dot" />

            Sales

          </div>

        </div>


        <SalesGraph
          period={period}
        />


      </section>


      {/* BOTTOM SECTION */}

      <div className="analytics-bottom">


        {/* ORDER PERFORMANCE */}

        <section className="analytics-box">

          <h2>
            Order Performance
          </h2>

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


        {/* TOP SELLING PRODUCTS */}

        <section className="analytics-box">

          <h2>
            Top Selling Products
          </h2>

          <div className="box-line" />


          {topProducts.map(
            (product, index) => (

              <div
                className="selling-product"
                key={product[0]}
              >

                <span>

                  <b>
                    {index + 1}.
                  </b>

                  {product[0]}

                </span>


                <strong>
                  {product[1]} sold
                </strong>

              </div>

            )
          )}


        </section>


      </div>


    </main>

  );

}