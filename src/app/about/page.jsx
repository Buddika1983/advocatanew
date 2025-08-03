import React from "react";

async function getAboutPageData() {
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
          query GetAboutPage {
  page(id: "about", idType: URI) {
    aboutIntroSection {
      aboutIntroTitle
      aboutIntroDescription
    }
    aboutUsBannerImage {
      aboutUsHeroBackgroundImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    faqSection {
      faqSection{
        faqItemTitle
        faqItemDescription
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

export default async function Page() {
  const data = await getAboutPageData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-black text-3xl bg-white">
        About Page Content Not Found
      </main>
    );
  }

  const { aboutIntroSection, aboutUsBannerImage, faqSection } = data;
  const { aboutIntroTitle, aboutIntroDescription } = aboutIntroSection || {};
  const bannerImage = aboutUsBannerImage?.aboutUsHeroBackgroundImage?.node;
  const imageUrl = bannerImage?.sourceUrl;
  const imageAlt = bannerImage?.altText || aboutIntroTitle || "About Banner";
  const faqItems = faqSection?.faqSection || [];

  return (
    <div className="bg-gray-100 overflow-x-hidden">
      {/* Banner Section */}
      <div className="about-hero">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            width={1628}
            height={700}
            className="w-full h-[700px] object-cover"
          />
        ) : (
          <div className="w-full h-[700px] bg-black text-yellow-400 flex items-center justify-center text-xl font-semibold">
            Banner image not found.
          </div>
        )}
      </div>

      {/* Intro Text Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl py-20 px-4">
          <div className="text-block">
            <span className="uppercase text-sm tracking-wide text-gray-500">
              Who We Are
            </span>
            <h3 className="text-3xl font-semibold mt-4 text-gray-800">
              {aboutIntroTitle}
            </h3>
            <div className="space-y-5 mt-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {aboutIntroDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      {faqItems.length > 0 && (
        <div
          className="relative overflow-hidden bg-white py-24 sm:py-32 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/accordion-bg-img.jpg')",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 md:px-11 xl:px-16">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-slate-50 uppercase text-sm tracking-wide">
                FAQ
              </span>
              <h2 className="text-slate-50 text-3xl font-bold mt-2">
                How can we help you?
              </h2>
            </div>

            <div className="mx-auto max-w-4xl mt-16 space-y-4">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="accordion bg-white/10 rounded-lg p-4 text-white"
                >
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-lg font-medium">
                      {item.faqItemTitle || "Untitled"}
                      <svg
                        className="ml-2 h-5 w-5 transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 9l7 7 7-7" />
                      </svg>
                    </summary>
                    <p className="mt-4 text-sm leading-6 text-white/90">
                      {item.faqItemDescription || "No description provided."}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
