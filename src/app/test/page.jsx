import React from "react";

async function getTestPage() {
  const res = await fetch("https://bpheadlessb418.wpenginepowered.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 10 },
    body: JSON.stringify({
      query: `
        query GetTestPage {
          page(id: "test", idType: URI) {
            title
            content
            testGroup {
              testTitle
              testDescription
              testImage {
                node {
                  sourceUrl
                  altText
                }
              }
              testRepeater {
                title
                image {
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
  });

  const json = await res.json();
  return json?.data?.page;
}

export default async function Page() {
  const pageData = await getTestPage();

  if (!pageData) {
    return (
      <main className="min-h-screen flex items-center justify-center text-black text-3xl bg-white">
        Test Page Content Not Found
      </main>
    );
  }

  const { title, content, testGroup } = pageData;
  const { testTitle, testDescription, testImage, testRepeater } = testGroup || {};
  const imageUrl = testImage?.node?.sourceUrl;
  const imageAlt = testImage?.node?.altText || testTitle;

  return (
    <div className="home-hero pt-32 pb-20 px-4 mx-auto text-gray-800 bg-white">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ACF Title */}
        {testTitle && (
          <h1 className="text-5xl font-bold font-serif text-center">{testTitle}</h1>
        )}

        {/* ACF Description */}
        {testDescription && (
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            {testDescription}
          </p>
        )}

        {/* ACF Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="mx-auto max-w-full h-auto rounded-xl shadow-lg"
          />
        )}

        {/* WP Page Content */}
        {content && (
          <div
            className="prose lg:prose-lg max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* ACF Repeater */}
        {testRepeater?.length > 0 && (
          <div className="grid gap-12 mt-12">
            {testRepeater.map((item, index) => {
              const repeaterImage = item?.image?.node?.sourceUrl;
              const repeaterAlt = item?.image?.node?.altText || item.title;

              return (
                <div
                  key={index}
                  className="text-center max-w-3xl mx-auto border border-gray-200 p-8 rounded-xl shadow-md"
                >
                  <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                  {repeaterImage && (
                    <img
                      src={repeaterImage}
                      alt={repeaterAlt}
                      className="mx-auto max-w-full h-auto rounded-lg shadow"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
