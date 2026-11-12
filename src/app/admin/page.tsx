import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession, hasRole } from "@/lib/auth";
import { ClubRepository } from "@/db/repository";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Dibba SCC",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session || !hasRole(session, ["super_admin", "editor", "academy_manager"])) {
    redirect("/admin/login");
  }

  const [news, matches, players, enquiries, auditLogs] = await Promise.all([
    ClubRepository.getNews(true),
    ClubRepository.getMatches(),
    ClubRepository.getPlayers(),
    ClubRepository.getEnquiries(),
    ClubRepository.getAuditLogs(),
  ]);

  return (
    <AdminDashboardClient
      session={session}
      initialNews={news}
      initialMatches={matches}
      initialPlayers={players}
      initialEnquiries={enquiries}
      initialAuditLogs={auditLogs}
    />
  );
}
