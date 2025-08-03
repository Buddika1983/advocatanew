"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SearchInput from "../../components/Search";

async function fetchCategories() {
  const res = await fetch(
    "https://bpheadlessb418.wpenginepowered.com/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          insightCategories {
            nodes {
              name
              slug
            }
          }
        }
      `,
      }),
    }
  );
  const json = await res.json();
  return json.data.insightCategories.nodes;
}

async function fetchInsightsByCategory(slug) {
  const isAll = slug === "all";
  const query = isAll
    ? `
      {
        insights {
          nodes {
            title
            slug
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    `
    : `
      query GetInsightsByCategory($slug: ID!) {
        insightCategory(id: $slug, idType: SLUG) {
          insights {
            nodes {
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    `;

  const variables = isAll ? {} : { slug };

  const res = await fetch(
    "https://bpheadlessb418.wpenginepowered.com/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    }
  );

  const json = await res.json();

  return isAll
    ? json.data.insights.nodes
    : json?.data?.insightCategory?.insights?.nodes || [];
}

export default function InsightsPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchCategories().then(setCategories);

    let hash = window.location.hash.replace("#", "") || "all";
    history.replaceState(null, "", `/insights/#${hash}`);
    setActiveCategory(hash);

    fetchInsightsByCategory(hash).then((data) => {
      setInsights(data);
      setCurrentPage(1);
      setLoading(false);
    });

    const onHashChange = () => {
      const newHash = window.location.hash.replace("#", "") || "all";
      setActiveCategory(newHash);
      setLoading(true);
      fetchInsightsByCategory(newHash).then((data) => {
        setInsights(data);
        setCurrentPage(1);
        setLoading(false);
      });
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleCategoryChange = (slug) => {
    if (slug !== activeCategory) {
      history.pushState(null, "", `/insights/#${slug}`);
      setActiveCategory(slug);
      setLoading(true);
      fetchInsightsByCategory(slug).then((data) => {
        setInsights(data);
        setCurrentPage(1);
        setLoading(false);
      });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(insights.length / itemsPerPage);
  const paginatedInsights = insights.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <main className="bg-gray-100 min-h-screen py-12">
      {/* Hero Section */}
      <div
        className="hero-block-container hero-basic pt-36 pb-20 bg-cover bg-center bg-no-repeat text-white text-center"
        style={{ backgroundImage: "url('/images/hero-basic-bg.jpg')" }}
      >
        <div className="hero-block max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl font-bold">Exploring Insights</h1>
          <p className="hero-paragraph mt-4">
            A dataset is a structured collection of data that is organized and
            stored for analysis, processing, or reference. Datasets typically
            consist of related data points grouped into tables, files, or
            arrays, making it easier to work with them in research, analytics,
            or machine learning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12">
        {/* Search Bar */}
        <SearchInput />

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full border ${
              activeCategory === "all"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            All
          </button>
          {categories
            .filter((cat) => cat.slug !== "all")
            .map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full border ${
                  activeCategory === cat.slug
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {/* Insights Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading insights...</p>
        ) : paginatedInsights.length === 0 ? (
          <p className="text-center text-gray-500">
            No insights available in this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedInsights.map((item, i) => (
                <Link key={i} href={`/insights/${item.slug}`}>
                  <div className="bg-white p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition">
                    <img
                      src={item.featuredImage?.node?.sourceUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded"
                    />
                    <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === num
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
