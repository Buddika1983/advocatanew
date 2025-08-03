import { gql } from 'graphql-request';
import client from '@/lib/graphql'; // or use correct relative path

export const metadata = {
    title: 'Testimonials',
};

export default async function TestimonialsPage() {
    const query = gql`
    query GetAllTestimonials {
      testimonials(first: 100) {
        nodes {
          id
          title
          slug
        }
      }
    }
  `;

    const data = await client.request(query);
    const testimonials = data?.testimonials?.nodes || [];

    return (
        <main className="min-h-screen bg-gray-900 text-white p-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Testimonials</h1>

            {testimonials.length === 0 ? (
                <p>No testimonials found.</p>
            ) : (
                <ul className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <li key={testimonial.id} className="p-4 bg-gray-800 rounded shadow">
                            <h2 className="text-xl font-semibold">{testimonial.title}</h2>
                            <p className="text-sm text-gray-400">Slug: {testimonial.slug}</p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
