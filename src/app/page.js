import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

/* ─────────────────────────────
  Fetch HOME‑page ACF fields
   ───────────────────────────── */
async function getHomePageData() {
  const res = await fetch(
    "https://bpheadlessb418.wpenginepowered.com/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 10 },
      body: JSON.stringify({
        query: `
        query GetHomePage {
          page(id: "home", idType: URI) {
            homeHeroSection {
              homeHeroTitle
              homeHeroDescription
            }
            homeAiIntroSection {
              homeAiText
            }
            homeDashboardImageSection{
              homeDashboardImage{
                node{
                  sourceUrl
                  altText
                }
              }
            }
            dashboardsCardsSection {
              dashboardsCardsDetails {
                dashboardCardTitle
                dashboardCardDescription
                dashboardCardLink
                dashboardImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      `,
      }),
    }
  );

  const json = await res.json();
  return json?.data?.page;
}

/* ──────────────────────────────
   Fetch latest INSIGHT posts
   ────────────────────────────── */
async function getInsights() {
  try {
    const res = await fetch(
      "https://bpheadlessb418.wpenginepowered.com/graphql",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
        body: JSON.stringify({
          query: `
            query GetInsights {
              insights(first: 3) {
                nodes {
                  id
                  title
                  excerpt(format: RENDERED)
                  date
                  slug
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          `,
        }),
      }
    );

    const json = await res.json();
    return json?.data?.insights?.nodes || [];
  } catch (error) {
    console.error("GraphQL Fetch Error (Insights):", error);
    return [];
  }
}

/* ──────────────────────────────
   Fetch dataset posts from CPT 'data-set'
   ────────────────────────────── */
async function getDatasets() {
  try {
    const res = await fetch(
      "https://bpheadlessb418.wpenginepowered.com/graphql",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 },
        body: JSON.stringify({
          query: `
  query GetAllDataSets {
    dataSets(first: 6) {
      nodes {
        id
        title
        excerpt(format: RENDERED)
        uri
        date
        modified
        homeDataSets {
          homeDataSetFile {
            node {
              file
              filePath
            }
          }
        }
      }
    }
  }
`,
        }),
      }
    );

    const json = await res.json();
    return json?.data?.dataSets?.nodes || [];
  } catch (error) {
    console.error("GraphQL Fetch Error (Datasets):", error);
    return [];
  }
}

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return `Updated just now`;

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `Updated ${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
}

/* ──────────────────────────────
   4.  Page Component
   ────────────────────────────── */
export default async function Home() {
  // Fetch page, insights, and datasets in parallel
  const [data, insights, datasets] = await Promise.all([
    getHomePageData(),
    getInsights(),
    getDatasets(),
  ]);

  /* HOME‑page ACF values */
  const hero = data?.homeHeroSection;
  const title = hero?.homeHeroTitle;
  const description = hero?.homeHeroDescription;
  const aiText = data?.homeAiIntroSection?.homeAiText;
  const dashboards = data?.dashboardsCardsSection?.dashboardsCardsDetails || [];
  const dashboardBgImage =
    data?.homeDashboardImageSection?.homeDashboardImage?.node?.sourceUrl;

  return (
    <>
      {/* ────────── Hero Section ────────── */}
      <main
        className="home-hero min-h-screen flex items-center justify-center px-6 bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundColor: "#812443",
        }}
      >
        <div className="hero-block-container max-w-4xl w-full text-center text-white">
          <div className="hero-block-center space-y-6">
            {title && (
              <h1 className="hero-title text-4xl md:text-5xl font-bold leading-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="hero-paragraph text-base md:text-lg text-white/90">
                {description}
              </p>
            )}
          </div>

          {/* Search Box */}
          <div className="mt-10">
            <div className="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search datasets, topics, or tags..."
                className="w-full py-4 pl-14 pr-36 rounded-full text-sm md:text-base bg-white/10 placeholder-white/70 text-white backdrop-blur border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all"
              />

              {/* Search icon (left) */}
              <div className="absolute top-1/2 left-5 -translate-y-1/2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011.5 19.5a7.5 7.5 0 005.15-2.85z"
                  />
                </svg>
              </div>

              {/* Buttons (right side) */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex gap-2">
                <button className="flex items-center px-5 py-2 rounded-full text-sm font-medium bg-white text-pink-900 hover:bg-gray-100 transition">
                  Search
                  <div className="search-icon ml-2">
                    <svg
                      stroke="#812443"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M9.58332 17.5C13.9556 17.5 17.5 13.9556 17.5 9.58333C17.5 5.21108 13.9556 1.66667 9.58332 1.66667C5.21107 1.66667 1.66666 5.21108 1.66666 9.58333C1.66666 13.9556 5.21107 17.5 9.58332 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.3333 18.3333L16.6667 16.6667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Image Section Start --> */}
      <div className="bg-white pb-0">
        <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
          <div className="ring-1 ring-black/10 rounded-3xl relative -top-32 md:-top-40 xl:-top-32 z-20">
            <img
              src={dashboardBgImage}
              className="rounded-3xl h-full w-full object-cover"
              width={1120}
              height={713}
              loading="lazy"
              alt="Home Image"
            />
          </div>
        </div>
      </div>

      {/* <!-- Image Section End --> */}

      {/* ────────── Dashboard Section ────────── */}
      <section className="bg-white py-24 sm:pb-32 -mt-18">
        <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="page-sub-title text-sm uppercase font-semibold text-[#4f082e]">
              dashboard
            </span>
            <h2 className="page-title text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Explore Our advance dashboards
            </h2>
            <div className="page-title-text">
              <p>
                Powered by Advocata’s cutting‑edge AI, our platform leverages
                advanced data insights to help you connect with people who share
                your values and interests.
              </p>
            </div>
          </div>

          {dashboards.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-6 md:gap-8 xl:gap-10 sm:mt-16 xl:grid-cols-6 xl:grid-rows-2">
              {dashboards.map((card, index) => (
                <div
                  key={index}
                  className={`flex p-px ${
                    index === 0
                      ? "xl:col-span-4"
                      : "xl:col-span-2 xl:row-span-2"
                  }`}
                >
                  <a
                    href={card.dashboardCardLink || "#"}
                    className="w-full block"
                  >
                    <div className="card card-type-1 h-full">
                      <div className="card-body">
                        {/* dashboard image */}
                        {card.dashboardImage?.node?.sourceUrl ? (
                          <div className="mb-4">
                            <img
                              src={card.dashboardImage.node.sourceUrl}
                              alt={
                                card.dashboardImage.node.altText ||
                                card.dashboardCardTitle ||
                                "dashboard image"
                              }
                              className="w-full h-auto rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mb-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="mt-1 block max-w-2xl">
                          <h2 className="card-title">
                            {card.dashboardCardTitle}
                          </h2>
                          <p className="card-text mt-4">
                            {card.dashboardCardDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────── AI Section ────────── */}
      {aiText && (
        <section
          className="relative overflow-hidden bg-white py-24 sm:py-32"
          style={{ backgroundImage: "url('/images/ai-section-bg.jpg')" }}
        >
          <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
              <div className="lg:pt-4 lg:pr-4 lg:w-2xl">
                <div className="max-w-lg lg:max-w-none">
                  <span className="text-xs font-semibold text-white bg-white/25 py-2 px-3 rounded-full uppercase font-family-manrope">
                    advanced AI
                  </span>
                  <h2 className="mt-5 xl:text-6xl sm:text-5xl text-3xl leading-9 md:leading-14 xl:leading-16 font-normal font-family-playfair text-pretty text-white whitespace-pre-line">
                    {aiText}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <img
            src="/images/ellipse.png"
            alt="Ellipse"
            width={410}
            height={410}
            className="absolute -left-32 -bottom-40 md:left-1/2 md:bottom-auto md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 lg:left-auto lg:right-16 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2"
          />
        </section>
      )}

      {/* <!-- Dataset Card Section Start --> */}
      <section className="bg-white py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="page-sub-title text-sm uppercase font-semibold text-[#4f082e]">
              Datasets
            </span>
            <h2 className="page-title text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Explore Our <span>Comprehensive Dataset</span> Collection
            </h2>
          </div>

          <div className="mx-auto my-8 md:my-11 grid max-w-2xl grid-cols-1 gap-6 xl:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 md:grid-cols-2">
            {datasets.length > 0 ? (
              datasets.map((dataset) => (
                <div key={dataset.id}>
                  <a
                    href={dataset.uri || "#"}
                    className="card card-type-6 h-full"
                  >
                    <div className="card-body">
                      <div className="flex-1">
                        <div>
                          <h2
                            className="text-lg font-semibold text-gray-900"
                            dangerouslySetInnerHTML={{ __html: dataset.title }}
                          />
                          <p
                            className="text-sm text-gray-700 mt-2"
                            dangerouslySetInnerHTML={{
                              __html:
                                dataset.excerpt || "No description available.",
                            }}
                          />
                        </div>
                      </div>
                      <div className="card-footer mt-4">
                        <div className="date-info text-xs text-gray-400">
                          <div className="card-footer mt-4">
                            <div className="flex items-center justify-between">
                              {/* <!-- Left section --> */}
                              <div className="pdf-btn flex items-center">
                                <svg
                                  className="pdf-icon"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {dataset?.homeDataSets?.homeDataSetFile?.node
                                  ?.filePath && (
                                  <a
                                    href={
                                      dataset.homeDataSets.homeDataSetFile.node
                                        .filePath
                                    }
                                    download
                                    className="text-xs text-gray-400 transition"
                                  >
                                    csv, json, xml, excel
                                  </a>
                                )}
                              </div>
                              {/* Right Section */}
                              <div className="date-info text-xs text-gray-400">
                                <time dateTime={dataset.modified}>
                                  {timeAgo(dataset.modified)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No datasets available right now.
              </p>
            )}
          </div>
          <div className="mx-auto max-w-7xl text-center">
            <a
              href="/datasets"
              className="inline-block btn text-white px-6 py-3 rounded-md font-medium"
              style={{ backgroundColor: "#4f082e" }}
            >
              View data catalog
            </a>
          </div>
        </div>
      </section>

      {/* Insight Card Section */}
      <div
        className="bg-brand-2-50 py-12 md:py-16 xl:py-24"
        style={{ backgroundColor: "#fdf2fa" }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm uppercase font-semibold text-[#4f082e]">
              Highlights
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Up to date with our latest news and updates
            </h2>
          </div>

          <div className="mx-auto my-8 md:my-11 grid max-w-2xl grid-cols-1 gap-6 xl:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 md:grid-cols-2">
            {insights.map((insight, index) => (
              <div key={insight.id || insight.slug || index}>
                <a
                  href={`/insight/${insight.slug}`}
                  className="card card-type-5 h-full"
                >
                  {insight.featuredImage?.node?.sourceUrl && (
                    <div>
                      <img
                        className="card-img"
                        src={insight.featuredImage.node.sourceUrl}
                        alt={
                          insight.featuredImage.node.altText ||
                          insight.title ||
                          "Insight image"
                        }
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="card-body p-4">
                    <div className="flex-1">
                      <div className="mt-2">
                        <span className="card-category">economy</span>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {insight.title}
                        </h2>
                        <p
                          className="text-sm text-gray-700 mt-2"
                          dangerouslySetInnerHTML={{
                            __html: insight.excerpt || "",
                          }}
                        ></p>
                      </div>
                    </div>
                    <div className="card-footer mt-4">
                      <div className="date-info text-xs text-gray-400">
                        <time dateTime={insight.modified || insight.date}>
                          {dayjs(insight.modified || insight.date).fromNow()}
                        </time>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-7xl text-center">
            <a
              href="/insights"
              className="inline-block btn text-white px-6 py-3 rounded-md font-medium"
              style={{ backgroundColor: "#4f082e" }}
            >
              Explore more
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
