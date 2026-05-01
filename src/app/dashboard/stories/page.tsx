import Link from 'next/link';

export default async function WeddingsPage() {
  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">My Weddings</h1>
          <p className="text-gray-600 mt-2">Manage and view all your weddings</p>
        </div>
        <Link href="#" className="btn btn-primary">
          + New Wedding
        </Link>
      </div>

      {/* Weddings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guests</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">RSVPs</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No weddings yet. Start by creating your first wedding!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
