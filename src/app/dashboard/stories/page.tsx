import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function StoriesPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Stories</h1>
          <p className="text-gray-600 mt-2">Manage and view all your stories</p>
        </div>
        <Link href="#" className="btn btn-primary">
          + New Story
        </Link>
      </div>

      {/* Stories List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No stories yet. Start by creating your first story!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
