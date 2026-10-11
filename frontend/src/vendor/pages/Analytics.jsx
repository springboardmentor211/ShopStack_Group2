import React, {
  useMemo,
  useState
} from "react";


const graphData = {

  "7": {

    labels: [
      "Sep 30",
      "Oct 01",
      "Oct 02",
      "Oct 03",
      "Oct 04",
      "Oct 05",
      "Oct 06"
    ],

    values: [
      1800,
      2400,
      2100,
      3200,
      2800,
      4100,
      4600
    ]

  },


  "30": {

    labels: [
      "Aug 21",
      "Aug 28",
      "Sep 04",
      "Sep 11",
      "Sep 19"
    ],

    values: [
      700,
      2600,
      4200,
      5200,
      5900
    ]

  },


  "90": {

    labels: [
      "Jul 01",
      "Jul 15",
      "Aug 01",
      "Aug 15",
      "Sep 01",
      "Sep 15",
      "Oct 01"
    ],

    values: [
      1200,
      1800,
      2500,
      3200,
      4100,
      5000,
      5900
    ]

  }

};


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


  const topProducts = [

    [
      "Heritage Portable Speaker",
      86
    ],

    [
      "Wireless Headphones",
      72
    ],

    [
      "Smart Watch",
      54
    ],

    [
      "Bluetooth Speaker",
      41
    ]

  ];


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


          <div className="performance-item">

            <div className="performance-heading">

              <span>
                Completed
              </span>

              <strong>
                180
              </strong>

            </div>

            <div className="progress-background">

              <div
                className="progress"
                style={{
                  width: "80%"
                }}
              />

            </div>

          </div>


          <div className="performance-item">

            <div className="performance-heading">

              <span>
                Processing
              </span>

              <strong>
                28
              </strong>

            </div>

            <div className="progress-background">

              <div
                className="progress processing"
                style={{
                  width: "12%"
                }}
              />

            </div>

          </div>


          <div className="performance-item">

            <div className="performance-heading">

              <span>
                Shipped
              </span>

              <strong>
                25
              </strong>

            </div>

            <div className="progress-background">

              <div
                className="progress shipped"
                style={{
                  width: "10%"
                }}
              />

            </div>

          </div>


          <div className="performance-item">

            <div className="performance-heading">

              <span>
                Pending
              </span>

              <strong>
                15
              </strong>

            </div>

            <div className="progress-background">

              <div
                className="progress pending"
                style={{
                  width: "7%"
                }}
              />

            </div>

          </div>


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