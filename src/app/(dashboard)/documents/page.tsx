import { getDocuments } from "@/app/actions";
import DocumentTable from "@/components/document-table";
import { formatBytes } from "@/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function DocumentsPage() {
  const session = await getSession();

  const documentRecords = await getDocuments(session?.user.user_id as number);

  const documentsData = documentRecords.map((document) => ({
    ...document,
    size: formatBytes(document.size),
    created_at: new Date(document.created_at).toLocaleDateString(),
  }));

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-gray-800">Documents</h1>
      <DocumentTable documents={documentsData} />
    </div>
  );
}
