import { getDocuments } from "@/app/actions";
import DocumentTable from "@/components/document-table";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const initialDocuments = await getDocuments(session.user.user_id);

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-gray-800">Documents</h1>
      <DocumentTable
        userId={session.user.user_id}
        initialDocuments={initialDocuments}
      />
    </div>
  );
}
