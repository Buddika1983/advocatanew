"use client";
import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/Search";
import Link from "next/link";

function parseHash() {
    const hash = window.location.hash.replace("#", "");
    const [slug = "all", page = "1"] = hash.split("|");
    return { slug, page: parseInt(page, 10) - 1 }; // 0-based index
}

function updateHash(slug, page) {
    const hash = `${slug}|${page + 1}`; // 1-based index
    history.pushState(null, "", `/datasets/#${hash}`);
}

const POSTS_PER_PAGE = 4;

async function fetchDatasetCategories() {
    const res = await fetch("https://bpheadlessb418.wpenginepowered.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
        {
          datasetCategories {
            nodes {
              name
              slug
            }
          }
        }
      `,
        }),
    });
    const json = await res.json();
    return json.data.datasetCategories.nodes;
}
async function fetchDatasets({ slug = "all", after = null }) {
    const isAll = slug === "all";

    const query = isAll
        ? `
      query GetAllDatasets($first: Int!, $after: String) {
        dataSets(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            slug
            excerpt
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
      query GetCategoryDatasets($slug: ID!, $first: Int!, $after: String) {
        datasetCategory(id: $slug, idType: SLUG) {
          dataSets(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              title
              slug
              excerpt
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

    const variables = isAll
        ? { first: POSTS_PER_PAGE, after }
        : { slug, first: POSTS_PER_PAGE, after };

    const res = await fetch("https://bpheadlessb418.wpenginepowered.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    const result = isAll ? json.data.dataSets : json.data.datasetCategory?.dataSets;

    return {
        datasets: result?.nodes || [],
        pageInfo: result?.pageInfo || {},
    };
}
export default function DatasetLandingPage() {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [datasets, setDatasets] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [cursors, setCursors] = useState([null]);
    const [currentCursorIndex, setCurrentCursorIndex] = useState(0);

    useEffect(() => {
        fetchDatasetCategories().then(setCategories);

        const hash = window.location.hash.replace("#", "");
        const initialCategory = hash || "all";

        setActiveCategory(initialCategory);
        fetchDatasets({ slug: initialCategory }).then((data) => {
            setDatasets(data.datasets);
            setPageInfo(data.pageInfo);
            setCursors([null]);
            setCurrentCursorIndex(0);
        });

        const onHashChange = () => {
            const newHash = window.location.hash.replace("#", "") || "all";
            setActiveCategory(newHash);
            setCursors([null]);
            setCurrentCursorIndex(0);
            fetchDatasets({ slug: newHash }).then((data) => {
                setDatasets(data.datasets);
                setPageInfo(data.pageInfo);
            });
        };

        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const handleCategoryChange = async (slug) => {
        setActiveCategory(slug);
        setCursors([null]);
        setCurrentCursorIndex(0);
        if (slug === "all") {
            history.pushState(null, "", "/datasets");
        } else {
            history.pushState(null, "", `/datasets/#${slug}`);
        }
        const data = await fetchDatasets({ slug });
        setDatasets(data.datasets);
        setPageInfo(data.pageInfo);
    };

    const handleNextPage = async () => {
        const data = await fetchDatasets({
            slug: activeCategory,
            after: pageInfo.endCursor,
        });
        setDatasets(data.datasets);
        setPageInfo(data.pageInfo);
        setCursors((prev) => [...prev, data.pageInfo.endCursor]);
        setCurrentCursorIndex((prev) => prev + 1);
    };

    const handlePreviousPage = async () => {
        if (currentCursorIndex === 0) return;
        const newIndex = currentCursorIndex - 1;
        const previousCursor = cursors[newIndex];
        const data = await fetchDatasets({
            slug: activeCategory,
            after: previousCursor,
        });
        setDatasets(data.datasets);
        setPageInfo(data.pageInfo);
        setCurrentCursorIndex(newIndex);
    };

    return (
        <main className="bg-gray-100 min-h-screen py-12">
            <div
                className="hero-block-container hero-basic pt-36 pb-20 bg-cover bg-center bg-no-repeat text-white text-center"
                style={{ backgroundImage: "url('/images/hero-basic-bg.jpg')" }}
            >
                <div className="hero-block max-w-4xl mx-auto">
                    <h1 className="hero-title text-4xl font-bold">Explore Datasets</h1>
                    <p className="hero-paragraph mt-4">
                        Browse structured data organized by categories to support research,
                        analytics, or insights.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12">
                <SearchInput />

                <div className="flex flex-wrap gap-4 justify-center mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={`px-4 py-2 rounded-full border transition-colors duration-200 ${activeCategory === cat.slug
                                ? "bg-black text-white border-black shadow-lg"
                                : "bg-white text-black border-gray-300 hover:bg-gray-200"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {datasets.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No datasets found in this category.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {datasets.map((item, i) => (
                            <Link
                                key={i}
                                href={`/datasets/${item.slug}`}
                                className="bg-white rounded-xl hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden border border-gray-100"
                            >
                                {item.featuredImage?.node?.sourceUrl && (
                                    <div className="h-48 w-full overflow-hidden">
                                        <img
                                            src={item.featuredImage.node.sourceUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col p-6">
                                    <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div
                                        className="text-sm text-gray-600 mb-4 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {(pageInfo?.hasNextPage || currentCursorIndex > 0) && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentCursorIndex}
                        cursors={cursors}
                        hasNextPage={pageInfo?.hasNextPage}
                        onPageChange={async (index) => {
                            const cursor = cursors[index];
                            const data = await fetchDatasets({
                                slug: activeCategory,
                                after: cursor,
                            });
                            setDatasets(data.datasets);
                            setPageInfo(data.pageInfo);
                            setCurrentCursorIndex(index);
                        }}
                        onNext={handleNextPage}
                    />
                </div>
            )}

        </main>
    );
}
