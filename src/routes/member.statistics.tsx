import { createFileRoute } from "@tanstack/react-router";
import { Page, useMember } from "@/components/member-kit";

export const Route = createFileRoute("/member/statistics")({
  head: () => ({ meta: [{ title: "Statistics View — Life OS Member" }, { name: "description", content: "Life OS team statistics." }] }),
  component: Stats,
});

type Node = { active: boolean; left_carry: number; right_carry: number; left: Node | null; right: Node | null };
const count = (n: Node | null): { all: number; active: number } => {
  if (!n) return { all: 0, active: 0 };
  const a = count(n.left), b = count(n.right);
  return { all: 1 + a.all + b.all, active: (n.active ? 1 : 0) + a.active + b.active };
};

function Stats() {
  const t = useMember<Node | null>("tree", "/tree/binary").data ?? null;
  const rank = useMember<{ lifetime_matchings: number; current: { name?: string } | null }>("rank", "/rank").data;
  const L = count(t?.left ?? null), R = count(t?.right ?? null);
  const rows: [string, React.ReactNode, React.ReactNode][] = [
    ["Total Members", L.all, R.all],
    ["Active Members", L.active, R.active],
    ["Inactive Members", L.all - L.active, R.all - R.active],
    ["Carry Forward", t?.left_carry ?? 0, t?.right_carry ?? 0],
  ];
  return (
    <Page title="Statistics Details View">
      <style>{`.stat th{text-align:left}.stat td{text-align:right;padding-right:15px}`}</style>
      <table width="60%" className="table stat" cellSpacing={0} cellPadding={0} style={{ margin: "20px auto" }}>
        <tbody>
          <tr><th style={{ width: "50%" }}>On The Position</th><th>Team A (Left)</th><th>Team B (Right)</th></tr>
          {rows.map(([k, a, b]) => <tr key={k}><th>{k}</th><td>{a}</td><td>{b}</td></tr>)}
        </tbody>
      </table>
      <p style={{ textAlign: "center" }}>Current Rank: <b>{rank?.current?.name ?? "Member"}</b> &ensp;|&ensp; Lifetime Matchings: <b>{rank?.lifetime_matchings ?? 0}</b></p>
    </Page>
  );
}
