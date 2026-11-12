"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import {
  LogOut,
  Newspaper,
  CalendarDays,
  Users,
  Inbox,
  ShieldAlert,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  Pencil,
  RefreshCw,
  Star,
} from "lucide-react";
import type {
  NewsArticleRecord,
  MatchRecord,
  PlayerRecord,
  EnquiryRecord,
  AuditLogRecord,
} from "@/db/seed-data";
import type { SessionPayload } from "@/lib/auth";
import { UAE_CLUB_PRESETS } from "@/lib/club-presets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaDropzonePicker } from "@/components/admin/MediaDropzonePicker";

interface AdminDashboardClientProps {
  session: SessionPayload;
  initialNews: NewsArticleRecord[];
  initialMatches: MatchRecord[];
  initialPlayers: PlayerRecord[];
  initialEnquiries: EnquiryRecord[];
  initialAuditLogs: AuditLogRecord[];
}

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "2026-11-20T18:30";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function AdminDashboardClient({
  session,
  initialNews,
  initialMatches,
  initialPlayers,
  initialEnquiries,
  initialAuditLogs,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [news, setNews] = useState(initialNews);
  const [matches, setMatches] = useState(initialMatches);
  const [players, setPlayers] = useState(initialPlayers);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // News create state
  const [slug, setSlug] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [excerptAr, setExcerptAr] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyAr, setBodyAr] = useState("");
  const [newsCategory, setNewsCategory] = useState<
    "club_news" | "first_team" | "academy" | "community" | "other_sports"
  >("club_news");
  const [newsImageUrl, setNewsImageUrl] = useState(
    "/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg"
  );

  // News edit modal state
  const [editingArticle, setEditingArticle] = useState<NewsArticleRecord | null>(null);

  // Player create state
  const [playerNameEn, setPlayerNameEn] = useState("");
  const [playerNameAr, setPlayerNameAr] = useState("");
  const [playerNum, setPlayerNum] = useState("10");
  const [playerPos, setPlayerPos] = useState<"GK" | "DEF" | "MID" | "FWD" | "STAFF">("MID");
  const [playerSquad, setPlayerSquad] = useState<"first_team" | "u23" | "academy">("first_team");
  const [playerNatEn, setPlayerNatEn] = useState("United Arab Emirates");
  const [playerNatAr, setPlayerNatAr] = useState("الإمارات العربية المتحدة");
  const [playerImageUrl, setPlayerImageUrl] = useState("/assets/player-mid-cutout.png");

  // Player edit modal state
  const [editingPlayer, setEditingPlayer] = useState<PlayerRecord | null>(null);

  // Match create / edit modal state
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [matchForm, setMatchForm] = useState({
    competitionEn: "UAE First Division League",
    competitionAr: "دوري الدرجة الأولى الإماراتي",
    homeTeamEn: "Dibba FC",
    homeTeamAr: "نادي دبا",
    homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
    awayTeamEn: "Fujairah FC",
    awayTeamAr: "نادي الفجيرة",
    awayLogo: "/assets/fujairah-web-logo.png",
    homeScore: "",
    awayScore: "",
    status: "scheduled" as "scheduled" | "finished",
    kickoffLocal: "2026-11-20T18:30",
    venueEn: "Dibba Stadium, Dibba Al Fujairah",
    venueAr: "استاد دبا، دبا الفجيرة",
    isNextMatch: false,
  });

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleCreateNews(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        titleEn,
        titleAr,
        excerptEn,
        excerptAr,
        bodyEn,
        bodyAr,
        category: newsCategory,
        imageUrl: newsImageUrl,
        published: true,
      }),
    });
    const json = await res.json();
    if (res.ok && json.article) {
      setNews((prev) => [json.article, ...prev]);
      setSlug("");
      setTitleEn("");
      setTitleAr("");
      setExcerptEn("");
      setExcerptAr("");
      setBodyEn("");
      setBodyAr("");
      setFeedback("Article published and public pages revalidated.");
    } else {
      setFeedback(json.error || "Failed to publish article.");
    }
  }

  async function handleSaveArticleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;
    const res = await fetch(`/api/news/${editingArticle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titleEn: editingArticle.titleEn,
        titleAr: editingArticle.titleAr,
        excerptEn: editingArticle.excerptEn,
        excerptAr: editingArticle.excerptAr,
        bodyEn: editingArticle.bodyEn,
        bodyAr: editingArticle.bodyAr,
        category: editingArticle.category,
        imageUrl: editingArticle.imageUrl,
        published: editingArticle.published,
      }),
    });
    const json = await res.json();
    if (res.ok && json.article) {
      setNews((prev) => prev.map((a) => (a.id === editingArticle.id ? json.article : a)));
      setEditingArticle(null);
      setFeedback(`Updated article "${json.article.titleEn}".`);
    } else {
      setFeedback(json.error || "Failed to update article.");
    }
  }

  async function handleTogglePublish(id: number) {
    const res = await fetch(`/api/news/${id}`, { method: "PATCH" });
    if (res.ok) {
      const json = await res.json();
      setNews((prev) => prev.map((a) => (a.id === id ? json.article : a)));
    }
  }

  async function handleDeleteNews(id: number) {
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) {
      setNews((prev) => prev.filter((a) => a.id !== id));
    }
  }

  function openNewMatchModal() {
    setEditingMatchId(null);
    setMatchForm({
      competitionEn: "UAE First Division League",
      competitionAr: "دوري الدرجة الأولى الإماراتي",
      homeTeamEn: "Dibba FC",
      homeTeamAr: "نادي دبا",
      homeLogo: "/assets/dibba-fc-logo-glossly-750.png",
      awayTeamEn: "Al Hamriyah",
      awayTeamAr: "الحمرية",
      awayLogo: "/assets/al-hamriyah-web-logo.png",
      homeScore: "",
      awayScore: "",
      status: "scheduled",
      kickoffLocal: "2026-12-05T18:30",
      venueEn: "Dibba Stadium, Dibba Al Fujairah",
      venueAr: "استاد دبا، دبا الفجيرة",
      isNextMatch: false,
    });
    setMatchModalOpen(true);
  }

  function openEditMatchModal(m: MatchRecord) {
    setEditingMatchId(m.id);
    setMatchForm({
      competitionEn: m.competitionEn,
      competitionAr: m.competitionAr,
      homeTeamEn: m.homeTeamEn,
      homeTeamAr: m.homeTeamAr,
      homeLogo: m.homeLogo,
      awayTeamEn: m.awayTeamEn,
      awayTeamAr: m.awayTeamAr,
      awayLogo: m.awayLogo,
      homeScore: m.homeScore !== null ? String(m.homeScore) : "",
      awayScore: m.awayScore !== null ? String(m.awayScore) : "",
      status: m.status,
      kickoffLocal: toDatetimeLocalValue(m.kickoffAt),
      venueEn: m.venueEn,
      venueAr: m.venueAr,
      isNextMatch: m.isNextMatch,
    });
    setMatchModalOpen(true);
  }

  function applyClubPreset(side: "home" | "away", clubId: string) {
    const preset = UAE_CLUB_PRESETS.find((c) => c.id === clubId);
    if (!preset) return;
    setMatchForm((prev) => ({
      ...prev,
      ...(side === "home"
        ? {
            homeTeamEn: preset.nameEn,
            homeTeamAr: preset.nameAr,
            homeLogo: preset.logo,
            venueEn: preset.stadiumEn,
            venueAr: preset.stadiumAr,
          }
        : {
            awayTeamEn: preset.nameEn,
            awayTeamAr: preset.nameAr,
            awayLogo: preset.logo,
          }),
    }));
  }

  async function handleSaveMatch(e: React.FormEvent) {
    e.preventDefault();
    const isoDate = new Date(matchForm.kickoffLocal).toISOString();
    const payload = {
      competitionEn: matchForm.competitionEn,
      competitionAr: matchForm.competitionAr,
      homeTeamEn: matchForm.homeTeamEn,
      homeTeamAr: matchForm.homeTeamAr,
      homeLogo: matchForm.homeLogo,
      awayTeamEn: matchForm.awayTeamEn,
      awayTeamAr: matchForm.awayTeamAr,
      awayLogo: matchForm.awayLogo,
      homeScore:
        matchForm.status === "finished" && matchForm.homeScore !== ""
          ? Number(matchForm.homeScore)
          : null,
      awayScore:
        matchForm.status === "finished" && matchForm.awayScore !== ""
          ? Number(matchForm.awayScore)
          : null,
      status: matchForm.status,
      kickoffAt: isoDate,
      venueEn: matchForm.venueEn,
      venueAr: matchForm.venueAr,
      isNextMatch: matchForm.status === "scheduled" ? matchForm.isNextMatch : false,
    };

    const url = editingMatchId ? `/api/matches/${editingMatchId}` : "/api/matches";
    const method = editingMatchId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.match) {
      if (editingMatchId) {
        setMatches((prev) =>
          prev.map((m) => {
            if (m.id === editingMatchId) return json.match;
            if (json.match.isNextMatch) return { ...m, isNextMatch: false };
            return m;
          })
        );
        setFeedback(`Updated fixture: ${json.match.homeTeamEn} vs ${json.match.awayTeamEn}.`);
      } else {
        setMatches((prev) => [
          json.match,
          ...prev.map((m) => (json.match.isNextMatch ? { ...m, isNextMatch: false } : m)),
        ]);
        setFeedback(`Added new fixture: ${json.match.homeTeamEn} vs ${json.match.awayTeamEn}.`);
      }
      setMatchModalOpen(false);
    } else {
      setFeedback(json.error || "Failed to save match.");
    }
  }

  async function handleUpdateMatchScore(match: MatchRecord, homeScore: number, awayScore: number) {
    const res = await fetch(`/api/matches/${match.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeScore, awayScore, status: "finished" }),
    });
    if (res.ok) {
      const json = await res.json();
      setMatches((prev) => prev.map((m) => (m.id === match.id ? json.match : m)));
      setFeedback(
        `Recorded ${homeScore}-${awayScore} FT for ${match.homeTeamEn} vs ${match.awayTeamEn} & refreshed table.`
      );
    }
  }

  async function handleDeleteMatch(id: number) {
    const res = await fetch(`/api/matches/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMatches((prev) => prev.filter((m) => m.id !== id));
      setFeedback(`Fixture #${id} removed and standings updated.`);
    }
  }

  async function handleSyncStandings() {
    setSyncing(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/cron/sync-matches", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setFeedback(
          `Match sync complete (${json.feedMode}). ${json.externalSynced} new fixtures imported; league table updated (${json.standingsCount} clubs).`
        );
      } else {
        setFeedback(json.error || "Sync failed.");
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleCreatePlayer(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameEn: playerNameEn,
        nameAr: playerNameAr,
        number: Number(playerNum) || 10,
        position: playerPos,
        squad: playerSquad,
        nationalityEn: playerNatEn,
        nationalityAr: playerNatAr,
        imageUrl: playerImageUrl,
        appearances: 0,
        goals: 0,
        assists: 0,
        bioEn: "Registered via Dibba SCC Admin Portal.",
        bioAr: "تمت الإضافة عبر بوابة إدارة نادي دبا.",
      }),
    });
    const json = await res.json();
    if (res.ok && json.player) {
      setPlayers((prev) => [...prev, json.player]);
      setPlayerNameEn("");
      setPlayerNameAr("");
      setFeedback(`Added ${json.player.nameEn} (#${json.player.number}) to squad roster.`);
    } else {
      setFeedback(json.error || "Failed to register player.");
    }
  }

  async function handleSavePlayerEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPlayer) return;
    const res = await fetch(`/api/players/${editingPlayer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameEn: editingPlayer.nameEn,
        nameAr: editingPlayer.nameAr,
        number: Number(editingPlayer.number),
        position: editingPlayer.position,
        squad: editingPlayer.squad,
        nationalityEn: editingPlayer.nationalityEn,
        nationalityAr: editingPlayer.nationalityAr,
        imageUrl: editingPlayer.imageUrl,
        appearances: Number(editingPlayer.appearances),
        goals: Number(editingPlayer.goals),
        assists: Number(editingPlayer.assists),
        bioEn: editingPlayer.bioEn,
        bioAr: editingPlayer.bioAr,
      }),
    });
    const json = await res.json();
    if (res.ok && json.player) {
      setPlayers((prev) => prev.map((p) => (p.id === editingPlayer.id ? json.player : p)));
      setEditingPlayer(null);
      setFeedback(`Updated player profile & stats for ${json.player.nameEn}.`);
    } else {
      setFeedback(json.error || "Failed to update player.");
    }
  }

  async function handleDeletePlayer(id: number) {
    const res = await fetch(`/api/players/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function handleEnquiryStatus(id: number, status: "new" | "in_review" | "resolved") {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const json = await res.json();
      setEnquiries((prev) => prev.map((item) => (item.id === id ? json.enquiry : item)));
    }
  }

  return (
    <div className="dark-surface min-h-screen bg-[#071426] text-[#F5F7FA]">
      {/* Admin Topbar */}
      <header className="border-b border-white/10 bg-[#050D1A] px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/dibba-fc-logo-glossly-750.png"
              alt="Dibba SCC"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <div>
              <h1 className="text-base font-bold text-white">Dibba SCC Self-Service Studio</h1>
              <p className="text-xs text-[#F5F7FA]/60">
                Signed in as {session.email} ({session.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/en">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Public Site</span>
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* KPI Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#0A2240]/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#66A3FF]">
              Published & Draft News
            </p>
            <p className="mt-2 text-3xl font-black text-white tabular-nums">{news.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A2240]/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D5A84B]">
              Fixtures & Results
            </p>
            <p className="mt-2 text-3xl font-black text-white tabular-nums">{matches.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A2240]/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Registered Squad
            </p>
            <p className="mt-2 text-3xl font-black text-white tabular-nums">{players.length}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A2240]/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pending Enquiries
            </p>
            <p className="mt-2 text-3xl font-black text-white tabular-nums">
              {enquiries.filter((e) => e.status === "new").length}
            </p>
          </div>
        </div>

        {feedback && (
          <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200">
            {feedback}
          </div>
        )}

        <Tabs.Root defaultValue="matches" className="space-y-6">
          <Tabs.List className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#0A2240]/60 p-1.5">
            <Tabs.Trigger
              value="matches"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/75 data-[state=active]:bg-[#2678FF] data-[state=active]:text-white cursor-pointer"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Fixtures & Scores</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="squad"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/75 data-[state=active]:bg-[#2678FF] data-[state=active]:text-white cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span>Squad & Photos</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="news"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/75 data-[state=active]:bg-[#2678FF] data-[state=active]:text-white cursor-pointer"
            >
              <Newspaper className="h-4 w-4" />
              <span>Newsroom</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="enquiries"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/75 data-[state=active]:bg-[#2678FF] data-[state=active]:text-white cursor-pointer"
            >
              <Inbox className="h-4 w-4" />
              <span>Enquiries ({enquiries.length})</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="audit"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/75 data-[state=active]:bg-[#2678FF] data-[state=active]:text-white cursor-pointer"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Audit Trail</span>
            </Tabs.Trigger>
          </Tabs.List>

          {/* Matches Tab */}
          <Tabs.Content value="matches" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0A2240]/60 p-4">
              <div>
                <h2 className="text-base font-bold text-white">Match Schedule & Live Standings Sync</h2>
                <p className="text-xs text-white/60">
                  Add fixtures, swap crests, mark Next Match, or auto-sync results into the league table.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSyncStandings}
                  disabled={syncing}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                  <span>{syncing ? "Syncing..." : "Sync & Recalculate Table"}</span>
                </Button>
                <Button size="sm" variant="gold" onClick={openNewMatchModal}>
                  <Plus className="h-4 w-4" />
                  <span>Add Fixture</span>
                </Button>
              </div>
            </div>

            {matches.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0A2240]/60 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={m.homeLogo}
                      alt={m.homeTeamEn}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                    <span className="text-xs font-bold text-white/50">vs</span>
                    <Image
                      src={m.awayLogo}
                      alt={m.awayTeamEn}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={m.status === "finished" ? "default" : "gold"}>
                        {m.status}
                      </Badge>
                      {m.isNextMatch && (
                        <Badge variant="blue">
                          <Star className="me-1 h-3 w-3" /> Next Match
                        </Badge>
                      )}
                      <span className="text-xs text-white/55">
                        {new Date(m.kickoffAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-white">
                      {m.homeTeamEn} vs {m.awayTeamEn}{" "}
                      {m.status === "finished" ? `(${m.homeScore} - ${m.awayScore})` : ""}
                    </p>
                    <p className="text-xs text-white/60">{m.venueEn}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateMatchScore(m, 2, 0)}
                  >
                    2-0 FT
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditMatchModal(m)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit Fixture</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteMatch(m.id)}
                    title="Delete Fixture"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </Tabs.Content>

          {/* Squad Tab */}
          <Tabs.Content value="squad" className="grid gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleCreatePlayer}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0A2240]/60 p-5 lg:col-span-5"
            >
              <h2 className="text-base font-bold text-white">Register Player & Cutout Photo</h2>
              <MediaDropzonePicker
                value={playerImageUrl}
                onChange={setPlayerImageUrl}
                defaultFilter="player"
                label="Player Photo / Transparent Cutout"
                allowCutoutToggle
              />
              <input
                type="text"
                required
                placeholder="Player Name (EN)"
                value={playerNameEn}
                onChange={(e) => setPlayerNameEn(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                dir="rtl"
                placeholder="اسم اللاعب (AR)"
                value={playerNameAr}
                onChange={(e) => setPlayerNameAr(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={playerNum}
                  onChange={(e) => setPlayerNum(e.target.value)}
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                />
                <select
                  value={playerPos}
                  onChange={(e) =>
                    setPlayerPos(e.target.value as "GK" | "DEF" | "MID" | "FWD" | "STAFF")
                  }
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                >
                  <option value="GK">GK</option>
                  <option value="DEF">DEF</option>
                  <option value="MID">MID</option>
                  <option value="FWD">FWD</option>
                  <option value="STAFF">STAFF</option>
                </select>
                <select
                  value={playerSquad}
                  onChange={(e) =>
                    setPlayerSquad(e.target.value as "first_team" | "u23" | "academy")
                  }
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                >
                  <option value="first_team">First Team</option>
                  <option value="u23">U23</option>
                  <option value="academy">Academy</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nationality (EN)"
                  value={playerNatEn}
                  onChange={(e) => setPlayerNatEn(e.target.value)}
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  dir="rtl"
                  placeholder="الجنسية (AR)"
                  value={playerNatAr}
                  onChange={(e) => setPlayerNatAr(e.target.value)}
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                <Plus className="h-4 w-4" />
                <span>Add to Roster</span>
              </Button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7 content-start">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0A2240]/60 p-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#071426]">
                      <Image
                        src={p.imageUrl}
                        alt={p.nameEn}
                        fill
                        unoptimized={p.imageUrl.startsWith("/uploads/")}
                        className="object-contain object-bottom"
                      />
                    </div>
                    <div className="min-w-0">
                      <Badge variant="gold">
                        #{p.number} · {p.position}
                      </Badge>
                      <p className="mt-1 truncate text-sm font-bold text-white">{p.nameEn}</p>
                      <p className="text-[11px] text-white/60 tabular-nums">
                        {p.appearances} Apps · {p.goals} G · {p.assists} A
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingPlayer(p)}
                      title="Edit Player & Stats"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeletePlayer(p.id)}
                      title="Remove Player"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>

          {/* News Tab */}
          <Tabs.Content value="news" className="grid gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleCreateNews}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0A2240]/60 p-5 lg:col-span-5"
            >
              <h2 className="text-base font-bold text-white">Publish Bilingual Article</h2>
              <MediaDropzonePicker
                value={newsImageUrl}
                onChange={setNewsImageUrl}
                defaultFilter="match"
                label="Cover Image"
              />
              <input
                type="text"
                required
                placeholder="url-slug-example"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <select
                value={newsCategory}
                onChange={(e) =>
                  setNewsCategory(
                    e.target.value as
                      | "club_news"
                      | "first_team"
                      | "academy"
                      | "community"
                      | "other_sports"
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              >
                <option value="club_news">Club News</option>
                <option value="first_team">First Team</option>
                <option value="academy">Academy</option>
                <option value="community">Community</option>
                <option value="other_sports">Other Sports</option>
              </select>
              <input
                type="text"
                required
                placeholder="Title (English)"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                dir="rtl"
                placeholder="العنوان (بالعربية)"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                placeholder="Excerpt (English)"
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                dir="rtl"
                placeholder="ملخص (بالعربية)"
                value={excerptAr}
                onChange={(e) => setExcerptAr(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={3}
                required
                placeholder="Full Body (English)"
                value={bodyEn}
                onChange={(e) => setBodyEn(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={3}
                required
                dir="rtl"
                placeholder="النص الكامل (بالعربية)"
                value={bodyAr}
                onChange={(e) => setBodyAr(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <Button type="submit" size="sm" className="w-full">
                <Plus className="h-4 w-4" />
                <span>Publish Article</span>
              </Button>
            </form>

            <div className="space-y-3 lg:col-span-7">
              {news.map((art) => (
                <div
                  key={art.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0A2240]/60 p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#071426]">
                      <Image
                        src={art.imageUrl}
                        alt={art.titleEn}
                        fill
                        unoptimized={art.imageUrl.startsWith("/uploads/")}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={art.published ? "success" : "default"}>
                          {art.published ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-white/50">/{art.slug}</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-white">{art.titleEn}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingArticle(art)}
                      title="Edit Article"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleTogglePublish(art.id)}
                      title="Toggle Visibility"
                    >
                      {art.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteNews(art.id)}
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>

          {/* Enquiries Tab */}
          <Tabs.Content value="enquiries" className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#0A2240]/60 p-5 md:flex-row md:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="gold">{enq.type}</Badge>
                    <Badge variant={enq.status === "resolved" ? "success" : "blue"}>
                      {enq.status}
                    </Badge>
                    <span className="text-sm font-bold text-white">{enq.fullName}</span>
                    <span className="text-xs text-white/60">
                      ({enq.email} · {enq.phone})
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#66A3FF]">
                    {enq.subject} {enq.program ? `· ${enq.program}` : ""}
                  </p>
                  <p className="text-xs text-white/75">{enq.message}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnquiryStatus(enq.id, "in_review")}
                  >
                    Mark In Review
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleEnquiryStatus(enq.id, "resolved")}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </Tabs.Content>

          {/* Audit Trail Tab */}
          <Tabs.Content value="audit" className="space-y-2">
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A2240]/60">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-white/10 bg-[#071426] text-white/60">
                    <th className="px-4 py-3 text-start">Timestamp</th>
                    <th className="px-4 py-3 text-start">Actor</th>
                    <th className="px-4 py-3 text-start">Action</th>
                    <th className="px-4 py-3 text-start">Resource</th>
                    <th className="px-4 py-3 text-start">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {initialAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-2.5 text-white/60 tabular-nums">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-white">{log.actorEmail}</td>
                      <td className="px-4 py-2.5 font-mono text-[#D5A84B]">{log.action}</td>
                      <td className="px-4 py-2.5 text-white/80">
                        {log.resourceType} #{log.resourceId}
                      </td>
                      <td className="px-4 py-2.5 text-white/60">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Match Create / Edit Modal */}
      <Dialog open={matchModalOpen} onOpenChange={setMatchModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/15 bg-[#0A2240] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white">
              {editingMatchId ? `Edit Fixture #${editingMatchId}` : "Schedule New Fixture"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMatch} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-white/10 bg-[#071426]/70 p-3">
                <label className="text-[11px] font-bold uppercase text-[#D5A84B]">
                  Home Club Preset
                </label>
                <select
                  onChange={(e) => applyClubPreset("home", e.target.value)}
                  defaultValue=""
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="" disabled>
                    Quick Select UAE Club...
                  </option>
                  {UAE_CLUB_PRESETS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={matchForm.homeTeamEn}
                  onChange={(e) => setMatchForm({ ...matchForm, homeTeamEn: e.target.value })}
                  placeholder="Home Team (EN)"
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={matchForm.homeTeamAr}
                  onChange={(e) => setMatchForm({ ...matchForm, homeTeamAr: e.target.value })}
                  placeholder="الفريق المضيف"
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                />
                <MediaDropzonePicker
                  value={matchForm.homeLogo}
                  onChange={(url) => setMatchForm({ ...matchForm, homeLogo: url })}
                  defaultFilter="crest"
                  label="Home Crest"
                />
              </div>

              <div className="space-y-2 rounded-xl border border-white/10 bg-[#071426]/70 p-3">
                <label className="text-[11px] font-bold uppercase text-[#66A3FF]">
                  Away Club Preset
                </label>
                <select
                  onChange={(e) => applyClubPreset("away", e.target.value)}
                  defaultValue=""
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="" disabled>
                    Quick Select UAE Club...
                  </option>
                  {UAE_CLUB_PRESETS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={matchForm.awayTeamEn}
                  onChange={(e) => setMatchForm({ ...matchForm, awayTeamEn: e.target.value })}
                  placeholder="Away Team (EN)"
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={matchForm.awayTeamAr}
                  onChange={(e) => setMatchForm({ ...matchForm, awayTeamAr: e.target.value })}
                  placeholder="الفريق الضيف"
                  className="w-full rounded-lg border border-white/15 bg-[#050D1A] px-2.5 py-1.5 text-xs text-white"
                />
                <MediaDropzonePicker
                  value={matchForm.awayLogo}
                  onChange={(url) => setMatchForm({ ...matchForm, awayLogo: url })}
                  defaultFilter="crest"
                  label="Away Crest"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-white/70">
                  Kickoff Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={matchForm.kickoffLocal}
                  onChange={(e) => setMatchForm({ ...matchForm, kickoffLocal: e.target.value })}
                  className="w-full rounded-lg border border-white/15 bg-[#071426] px-2.5 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-white/70">Status</label>
                <select
                  value={matchForm.status}
                  onChange={(e) =>
                    setMatchForm({
                      ...matchForm,
                      status: e.target.value as "scheduled" | "finished",
                    })
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#071426] px-2.5 py-2 text-xs text-white"
                >
                  <option value="scheduled">Scheduled (Upcoming)</option>
                  <option value="finished">Finished (Full Time)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-white/70">Home</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    disabled={matchForm.status !== "finished"}
                    value={matchForm.homeScore}
                    onChange={(e) => setMatchForm({ ...matchForm, homeScore: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-2.5 py-2 text-xs text-white disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-white/70">Away</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    disabled={matchForm.status !== "finished"}
                    value={matchForm.awayScore}
                    onChange={(e) => setMatchForm({ ...matchForm, awayScore: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-2.5 py-2 text-xs text-white disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                value={matchForm.venueEn}
                onChange={(e) => setMatchForm({ ...matchForm, venueEn: e.target.value })}
                placeholder="Venue (EN)"
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                dir="rtl"
                value={matchForm.venueAr}
                onChange={(e) => setMatchForm({ ...matchForm, venueAr: e.target.value })}
                placeholder="الملعب (AR)"
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#D5A84B] cursor-pointer">
              <input
                type="checkbox"
                checked={matchForm.isNextMatch}
                disabled={matchForm.status !== "scheduled"}
                onChange={(e) => setMatchForm({ ...matchForm, isNextMatch: e.target.checked })}
                className="h-4 w-4 rounded border-white/20"
              />
              <span>Pin as Official Next Match (Hero Countdown & Broadcast Strip)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setMatchModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingMatchId ? "Save Fixture Changes" : "Publish Fixture"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Player Edit Modal */}
      <Dialog open={Boolean(editingPlayer)} onOpenChange={(o) => !o && setEditingPlayer(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/15 bg-[#0A2240] text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white">
              Edit Player Profile & Season Stats
            </DialogTitle>
          </DialogHeader>
          {editingPlayer && (
            <form onSubmit={handleSavePlayerEdit} className="space-y-3">
              <MediaDropzonePicker
                value={editingPlayer.imageUrl}
                onChange={(url) => setEditingPlayer({ ...editingPlayer, imageUrl: url })}
                defaultFilter="player"
                label="Player Cutout / Photo"
                allowCutoutToggle
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={editingPlayer.nameEn}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, nameEn: e.target.value })}
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={editingPlayer.nameAr}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, nameAr: e.target.value })}
                  className="rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-white/60">Jersey #</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={editingPlayer.number}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, number: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/60">Position</label>
                  <select
                    value={editingPlayer.position}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        position: e.target.value as PlayerRecord["position"],
                      })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  >
                    <option value="GK">GK</option>
                    <option value="DEF">DEF</option>
                    <option value="MID">MID</option>
                    <option value="FWD">FWD</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/60">Squad Tier</label>
                  <select
                    value={editingPlayer.squad}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        squad: e.target.value as PlayerRecord["squad"],
                      })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  >
                    <option value="first_team">First Team</option>
                    <option value="u23">U23</option>
                    <option value="academy">Academy</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-white/60">Appearances</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPlayer.appearances}
                    onChange={(e) =>
                      setEditingPlayer({
                        ...editingPlayer,
                        appearances: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/60">Goals</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPlayer.goals}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, goals: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/60">Assists</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPlayer.assists}
                    onChange={(e) =>
                      setEditingPlayer({ ...editingPlayer, assists: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={editingPlayer.bioEn}
                onChange={(e) => setEditingPlayer({ ...editingPlayer, bioEn: e.target.value })}
                placeholder="Bio (EN)"
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={2}
                dir="rtl"
                value={editingPlayer.bioAr}
                onChange={(e) => setEditingPlayer({ ...editingPlayer, bioAr: e.target.value })}
                placeholder="السيرة (AR)"
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingPlayer(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Save Player Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Article Edit Modal */}
      <Dialog open={Boolean(editingArticle)} onOpenChange={(o) => !o && setEditingArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/15 bg-[#0A2240] text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-white">
              Edit Bilingual Article
            </DialogTitle>
          </DialogHeader>
          {editingArticle && (
            <form onSubmit={handleSaveArticleEdit} className="space-y-3">
              <MediaDropzonePicker
                value={editingArticle.imageUrl}
                onChange={(url) => setEditingArticle({ ...editingArticle, imageUrl: url })}
                defaultFilter="match"
                label="Cover Image"
              />
              <input
                type="text"
                required
                value={editingArticle.titleEn}
                onChange={(e) => setEditingArticle({ ...editingArticle, titleEn: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                required
                dir="rtl"
                value={editingArticle.titleAr}
                onChange={(e) => setEditingArticle({ ...editingArticle, titleAr: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={2}
                required
                value={editingArticle.excerptEn}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, excerptEn: e.target.value })
                }
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={4}
                required
                value={editingArticle.bodyEn}
                onChange={(e) => setEditingArticle({ ...editingArticle, bodyEn: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <textarea
                rows={4}
                required
                dir="rtl"
                value={editingArticle.bodyAr}
                onChange={(e) => setEditingArticle({ ...editingArticle, bodyAr: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-[#071426] px-3 py-2 text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingArticle(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold">
                  Save Article
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
