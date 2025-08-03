import React from "react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function DatasetPage({ params }) {
  const res = await fetch("https://bpheadlessb418.wpenginepowered.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query GetDatasetBySlug($slug: ID!) {
          dataSet(id: $slug, idType: SLUG) {
            title
            excerpt
            date
            slug
            content
          }
        }
      `,
      variables: { slug: params.slug },
    }),
    next: { revalidate: 10 },
  });

  const relatedRes = await fetch("https://bpheadlessb418.wpenginepowered.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
      query GetAllDatasets {
        dataSets(first: 4) {
        nodes {
        title
              slug
      excerpt
      featuredImage {
        node {
        sourceUrl
                  altText
                }
              }
            }
          }
        }
      `
    }),
    next: { revalidate: 10 },
  });

  const relatedJson = await relatedRes.json();
  const relatedDatasets = relatedJson?.data?.dataSets?.nodes?.filter(ds => ds.slug !== params.slug) || [];


  const json = await res.json();
  const dataset = json?.data?.dataSet;

  if (!dataset) {
    return (
      <div className="p-10 text-center text-lg text-red-500">
        Dataset not found for slug: {params?.slug}
      </div>
    );
  }

  const { title, content } = dataset;

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 mt-10">
      {/* Main content card */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="mb-5">
            <nav className="flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-2 text-gray-500 text-sm">
                <li>
                  <div className="flex items-center">
                    <Link href="/" className="hover:text-gray-700 flex items-center">
                      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="w-5 h-5 mr-1">
                        <path
                          fillRule="evenodd"
                          d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">Home</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-4 h-4 mx-2">
                      <path d="M7.425 16.6L12.8583 11.1667C13.5 10.525 13.5 9.475 12.8583 8.83333L7.425 3.4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <a href="/datasets" className="text-gray-700 font-medium" aria-current="page">Datasets</a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Title & content */}
          <h1 className="text-4xl font-serif font-semibold leading-tight mb-4 text-gray-900 max-w-2xl">
            {title}
          </h1>
          <div className="space-y-2.5 max-w-2xl">
            {content && (
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Download options section */}
      <div className="bg-white pb-3.5 rounded-lg shadow">
        <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* PDF card */}
            <div>
              <a href="#" className="block rounded-lg border border-gray-200 hover:shadow-lg transition-shadow bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">PDF</h2>
                    <p className="text-gray-500 text-sm">You can access your file via PDF</p>
                  </div>
                  <div className="ml-4 text-blue-600">
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
                      <path d="M21 15.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V15.5M7 10.5L12 15.5M12 15.5L17 10.5M12 15.5V3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>

            {/* Excel card */}
            <div>
              <a href="#" className="card card-type-7 block rounded-lg border border-gray-200 hover:shadow-lg transition-shadow bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Excel</h2>
                    <p className="text-gray-500 text-sm">You can access your file via Excel</p>
                  </div>
                  <div className="ml-4 text-blue-600">
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
                      <path d="M21 15.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V15.5M7 10.5L12 15.5M12 15.5L17 10.5M12 15.5V3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>

            {/* CSV card */}
            <div>
              <a href="#" className="card card-type-7 block rounded-lg border border-gray-200 hover:shadow-lg transition-shadow bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">CSV</h2>
                    <p className="text-gray-500 text-sm">You can access your file via CSV</p>
                  </div>
                  <div className="ml-4 text-blue-600">
                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none">
                      <path d="M21 15.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V15.5M7 10.5L12 15.5M12 15.5L17 10.5M12 15.5V3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Datasets Section */}
      {relatedDatasets.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Datasets</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedDatasets.map((ds) => (
              <Link href={`/datasets/${ds.slug}`} key={ds.slug} className="group block rounded-lg border border-gray-200 hover:shadow-md transition bg-white overflow-hidden">
                {ds.featuredImage?.node?.sourceUrl && (
                  <div className="h-48 relative">
                    <Image
                      src={ds.featuredImage.node.sourceUrl}
                      alt={ds.featuredImage.node.altText || ds.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{ds.title}</h3>
                  <div
                    className="text-gray-600 text-sm mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: ds.excerpt }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
