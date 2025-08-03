import { gql } from 'graphql-request';
import client from '@/lib/graphql'; // adjust path if alias not set

export async function generateMetadata({ params }) {
    return {
        title: `Testimonial - ${params.slug}`,
    };
}

export default async function SingleTestimonial({ params }) {
    const { slug } = params;

    const query = gql`
    query GetSingleTestimonial($slug: String!) {
      testimonialBy(slug: $slug) {
        title
        content
        testimonialFields {
          clientName
          clientCompany
        }
      }
    }
  `;

    const data = await client.request(query, { slug });
    const testimonial = data?.testimonialBy;

    if (!testimonial) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <h1 className="text-2xl">Testimonial Not Found</h1>
            </main>
        );
    }

    const { title, content, testimonialFields } = testimonial;

    return (
        <main className="min-h-screen bg-gray-900 text-white p-10 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            {testimonialFields?.clientName && (
                <p className="text-lg text-gray-300 mb-2">
                    <strong>Client:</strong> {testimonialFields.clientName}
                </p>
            )}

            {testimonialFields?.clientCompany && (
                <p className="text-lg text-gray-300 mb-4">
                    <strong>Company:</strong> {testimonialFields.clientCompany}
                </p>
            )}

            <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </main>
    );
}
