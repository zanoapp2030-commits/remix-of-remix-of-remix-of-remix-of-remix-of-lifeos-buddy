import { createFileRoute } from "@tanstack/react-router";
import { Page, useMember } from "@/components/member-kit";

export const Route = createFileRoute("/member/statistics")({
  head: () => ({ meta: [{ title: "Statistics View — Life OS Member" }, { name: "description", content: "Life OS team statistics." }] }),
  component: Stats,
});

type Node = { active: boolean; left: Node | null; right: Node | null };
const count = (n: Node | null): { all: number; active: number } => {
  if (!n) return { all: 0, active: 0 };
  const a = count(n.left), b = count(n.right);
  return { all: 1 + a.all + b.all, active: (n.active ? 1 : 0) + a.active + b.active };
};

const RANKS: [string, number][] = [
  ["Free Member", 0],
  ["Silver Executive", 100],
  ["Gold Executive", 300],
  ["Gold/Executive", 1000],
  ["Platinum Executive", 5000],
  ["Diamond Executive", 25000],
  ["Crown Executive", 125000],
  ["Ambassador", 500000],
  ["Global Ambassador", 1500000],
];

function Stats() {
  const t = useMember<Node | null>("tree", "/tree/binary").data ?? null;
  const rank = useMember<{ lifetime_matchings: number }>("rank", "/rank").data;
  const m = rank?.lifetime_matchings ?? 0;
  const L = count(t?.left ?? null), R = count(t?.right ?? null);
  return (
    <Page title="Statistics Details View">
      <table width="60%" className="table stat" cellSpacing={7} cellPadding={4} style={{ margin: "10px 0" }}>
        <thead>
          <tr>
            <th align="left">On The Position</th>
            <th>Team A's Value</th>
            <th>Team B's Value</th>
          </tr>
        </thead>
        <tbody>
          {RANKS.map(([name, need]) => (
            <tr key={name} style={{ background: m >= need ? "#d9f0e0" : undefined }}>
              <th align="left">{name}</th>
              <td align="center">{L.all}</td>
              <td align="center">{R.all}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ textAlign: "left" }}>Current Rank: <b>{m >= 100 ? "Silver Executive" : "Free Member"}</b> &ensp;|&ensp; Lifetime Matchings: <b>{m}</b></p>
    </Page>
  );
}
