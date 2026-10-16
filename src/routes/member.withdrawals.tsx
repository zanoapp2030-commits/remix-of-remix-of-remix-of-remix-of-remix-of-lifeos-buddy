import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Msg, Page, useMember } from "@/components/member-kit";
import { bdt, memberApi } from "@/lib/member-api";

export const Route = createFileRoute("/member/withdrawals")({
  head: () => ({ meta: [{ title: "Withdrawals Form — Life OS Member" }, { name: "description", content: "Request a Life OS withdrawal." }] }),
  component: Withdraw,
});

function Withdraw() {
  const w = useMember<{ withdrawable: number; pending_withdrawal: number }>("wallet", "/wallet");
  const [f, setF] = useState({ method: "bKash", account_number: "", amount: "" });
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(f.amount) > Number(w.data?.withdrawable ?? 0)) return setMsg({ ok: false, t: "Amount is more than your withdrawable balance." });
    try {
      await memberApi("/withdrawals", { body: { ...f, amount: Number(f.amount) } });
      setMsg({ ok: true, t: "Withdrawal request submitted successfully." });
      setF({ ...f, amount: "" });
      w.refetch();
    } catch (err) { setMsg({ ok: false, t: (err as Error).message }); }
  };
  return (
    <Page title="Withdrawals Form">
      <form onSubmit={submit}>
        <Msg ok={msg?.ok} text={msg?.t ?? null} />
        <table width="60%" border={0} cellSpacing={5} cellPadding={0} style={{ margin: "20px auto" }}>
          <tbody>
            <tr><td width="35%">Withdrawable Balance</td><td width="2%">:</td><td><b>{bdt(w.data?.withdrawable)}</b></td></tr>
            <tr><td>Pending Withdrawals</td><td>:</td><td>{bdt(w.data?.pending_withdrawal)}</td></tr>
            <tr><td>Payment Method</td><td>:</td><td>
              <select value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>
                {["bKash", "Nagad", "Rocket", "Bank"].map((m) => <option key={m}>{m}</option>)}
              </select></td></tr>
            <tr><td>Account Number</td><td>:</td><td><input type="text" required value={f.account_number} onChange={(e) => setF({ ...f, account_number: e.target.value })} /></td></tr>
            <tr><td>Amount (min 500)</td><td>:</td><td><input type="number" min={500} required value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></td></tr>
            <tr><td /><td /><td><input type="submit" value="Submit Request" /></td></tr>
          </tbody>
        </table>
      </form>
    </Page>
  );
}
