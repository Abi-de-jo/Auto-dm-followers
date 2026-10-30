"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { PageSkeleton } from "@/components/PageSkeleton";
import { PageLoadError } from "@/components/PageLoadError";
import { SessionExpired } from "@/components/SessionExpired";
import { CheckCircle2, Copy, Download, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptySignal,
  MetaItem,
  SectionHeader,
  SignalCell,
  SignalFact,
  SignalHeader,
  SignalPage,
  SignalPanel,
  StatusChip,
} from "@/components/workspace/signal-ui";

interface LeadItem {
  id: string;
  email: string;
  username: string;
  source: string;
  capturedAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [authExpired, setAuthExpired] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoadError(false);
    setAuthExpired(false);
    try {
      const res = await fetch("/api/leads");
      if (res.status === 401) {
        setAuthExpired(true);
        setLoadError(true);
        return;
      }
      if (!res.ok) throw new Error("Could not load leads");
      const data = (await res.json()) as { leads?: LeadItem[]; total?: number };
      if (Array.isArray(data?.leads)) {
        setLeads(data.leads);
        setTotal(data.total || data.leads.length);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return lead.email.toLowerCase().includes(q) || lead.username.toLowerCase().includes(q) || lead.source.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Email", "Instagram Username", "Source Automation", "Captured At"];
    const rows = leads.map((l) => [l.email, l.username, l.source, new Date(l.capturedAt).toISOString()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `freshdm-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyEmail = async (email: string, id: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  if (loading && leads.length === 0) return <AppLayout><div className="signal-page"><PageSkeleton kind="leads" /></div></AppLayout>;
  if (authExpired) return <AppLayout><div className="signal-page"><SessionExpired /></div></AppLayout>;
  if (loadError && leads.length === 0) return <AppLayout><div className="signal-page"><PageLoadError onRetry={fetchLeads} /></div></AppLayout>;

  return (
    <AppLayout>
      <SignalPage>
        <span aria-live="polite" className="sr-only">{copiedId ? "Email address copied" : ""}</span>

        <SignalHeader
          title="Email leads"
          description="People who shared their email in an Instagram chat. We send them the link you set up."
          badge={
            <StatusChip tone="success">
              <Mail className="h-3 w-3" aria-hidden="true" />
              Emails sent automatically
            </StatusChip>
          }
          actions={
            <Button
              onClick={exportCSV}
              disabled={leads.length === 0}
              variant="secondary"
              size="sm"
              className="h-9 gap-2 px-3.5"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export CSV
            </Button>
          }
          meta={
            <>
              <MetaItem label="Collected" value={`${total} leads`} />
              <MetaItem label="Delivery" value="Automatic" tone="success" />
              <MetaItem label="Status" value="On" tone="violet" />
              <MetaItem label="Source" value="Instagram DM" tone="violet" />
            </>
          }
        />

        {loadError && !authExpired && <PageLoadError onRetry={fetchLeads} />}

        <div className="signal-panel signal-strip signal-strip--four" role="group" aria-label="Lead metrics">
          <SignalCell label="Emails collected" value={total} hint="shared in an Instagram chat" tone="white" />
          <SignalCell label="Matching leads" value={filteredLeads.length} hint="current search results" tone="violet" />
          <SignalFact label="Email delivery" value="Automatic" hint="sent as soon as an email arrives" tone="success" />
          <SignalFact label="Delivery status" value="On" hint="sends the link you configured" tone="violet" />
        </div>

        <SignalPanel>
          <SectionHeader
            icon={Mail}
            title="Lead ledger"
            description="Every email captured by your reply rules, newest first."
            action={<StatusChip tone="violet">{filteredLeads.length} showing</StatusChip>}
          />

          <div className="border-b border-white/[0.075] p-4">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8797]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by email, username, or reply name…"
                aria-label="Search email leads"
                className="signal-input"
              />
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <EmptySignal
              icon={Mail}
              title={search.trim() ? "No matching emails" : "No email leads yet"}
              description={
                search.trim()
                  ? "Try a different email, username, or reply name."
                  : "When someone replies to your Instagram message with their email, it appears here and we email them your link automatically."
              }
            />
          ) : (
            <div className="signal-table-shell">
              <table className="signal-table">
                <thead>
                  <tr>
                    <th scope="col">Email address</th>
                    <th scope="col">Instagram username</th>
                    <th scope="col">Reply name</th>
                    <th scope="col">Collected</th>
                    <th scope="col" className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="font-mono text-[#11271D]">{lead.email}</td>
                      <td className="text-[#059669] font-semibold">@{lead.username}</td>
                      <td>{lead.source}</td>
                      <td className="font-mono text-[11px]">
                        {new Date(lead.capturedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="text-right">
                        <Button
                          type="button"
                          onClick={() => copyEmail(lead.email, lead.id)}
                          variant="secondary"
                          size="sm"
                          className="h-7 gap-1.5 px-2.5 text-[10px]"
                          aria-label={copiedId === lead.id ? `Copied ${lead.email}` : `Copy ${lead.email}`}
                        >
                          {copiedId === lead.id ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" aria-hidden="true" />
                              Copy
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SignalPanel>
      </SignalPage>
    </AppLayout>
  );
}
