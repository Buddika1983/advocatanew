import React from "react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function InsightPage({ params }) {
  const res = await fetch(
    "https://bpheadlessb418.wpenginepowered.com/graphql",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetInsightBySlug($slug: ID!) {
            insight(id: $slug, idType: SLUG) {
              title
              content
              date
              slug
            }
            insights(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
              nodes {
                id
                title
                excerpt
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
        variables: { slug: params.slug },
      }),
      next: { revalidate: 10 },
    }
  );

  const json = await res.json();
  const insight = json?.data?.insight;
  let relatedInsights = json?.data?.insights?.nodes || [];

  if (!insight) {
    return (
      <div className="p-10 text-center text-lg text-red-500">
        Insight not found for slug: {params.slug}
      </div>
    );
  }

  relatedInsights = relatedInsights.filter(
    (post) => post.slug !== insight.slug
  );

  const formattedDate = new Date(insight.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div key={params.slug}>
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-5xl mx-auto px-6 pt-14 text-center">
          <nav className="mb-6 flex justify-center" aria-label="Breadcrumb">
            <ol className="flex space-x-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="flex items-center hover:text-white">
                  <svg
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
                <Link href="/insights" className="hover:text-white">
                  Insights
                </Link>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">{insight.title}</h1>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {insight.content ? (
          <div
            className="prose lg:prose-lg grid gap-y-5"
            dangerouslySetInnerHTML={{ __html: insight.content }}
          />
        ) : (
          <p className="text-center text-gray-600">Content not available.</p>
        )}
      </div>

      {/* Related Insights Section */}
      {relatedInsights.length > 0 && (
        <div className="w-full bg-gray-100 py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <span className="text-sm uppercase font-semibold text-[#4f082e]">
              Highlights
            </span>
            <h2 className="text-3xl font-semibold mb-10 text-left text-gray-800">
              See other Highlights
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.slice(0, 3).map((post) => {
                const postDate = new Date(post.date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                );
                return (
                  <Link key={post.id} href={`/insights/${post.slug}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                      {post.featuredImage?.node?.sourceUrl && (
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          width={600}
                          height={400}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {post.title}
                        </h3>
                        <div
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: post.excerpt }}
                        />
                        <div className="text-xs text-gray-500">
                          <time dateTime={post.date}>{postDate}</time>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
