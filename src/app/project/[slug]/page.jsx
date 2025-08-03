import React from "react";

async function getProjectBySlug(slug) {
  const res = await fetch(
    "https://bpheadlessb418.wpenginepowered.com/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 },
      body: JSON.stringify({
        query: `
        query GetProjectBySlug($slug: ID!) {
          project(id: $slug, idType: SLUG) {
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            projectFields {
              summary
              contentArea
            }
          }
        }
      `,
        variables: {
          slug,
        },
      }),
    }
  );

  const json = await res.json();
  return json?.data?.project;
}

export default async function ProjectSingle({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white text-3xl bg-gray-900">
        Project Not Found
      </main>
    );
  }

  const { title, featuredImage, projectFields } = project;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>

      {featuredImage?.node?.sourceUrl && (
        <img
          src={featuredImage.node.sourceUrl}
          alt={featuredImage.node.altText || title}
          className="rounded-lg shadow-lg max-w-full mb-6"
        />
      )}

      {projectFields?.summary && (
        <p className="text-lg mb-6 text-center text-gray-300">
          {projectFields.summary}
        </p>
      )}

      {projectFields?.contentArea && (
        <div
          className="prose prose-invert max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: projectFields.contentArea }}
        />
      )}
    </main>
  );
}
