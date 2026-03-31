import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn, getInitials } from "@/lib/utils";
import { MessageSquare, Send, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MessagesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeConv, setActiveConv] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const { data: convos = [] } = useQuery({ queryKey: ["conversations"], queryFn: () => messagesApi.conversations().then((r) => r.data), refetchInterval: 10000 });
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", activeConv],
    queryFn: () => messagesApi.messages(activeConv!).then((r) => r.data),
    enabled: !!activeConv,
    refetchInterval: 5000,
  });

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || (!msg.trim() && !file)) return;
    setSending(true);
    try {
      await messagesApi.send(activeConv, msg.trim() || undefined, file || undefined);
      setMsg("");
      setFile(null);
      qc.invalidateQueries({ queryKey: ["messages", activeConv] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    } catch {}
    setSending(false);
  };

  const peerName = (c: any) => {
    if (c.admin_landlord) return user?.role === "admin" ? (c.landlord_name || "Landlord") : "Admin";
    return user?.role === "tenant" ? (c.landlord_name || "Landlord") : (c.tenant_name || "Tenant");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-fade-in">
      {/* Conversations sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-border overflow-y-auto">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold text-card-foreground">Messages</h2>
        </div>
        {convos.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No conversations yet</div>
        ) : (
          convos.map((c: any) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={cn(
                "w-full border-b border-border p-3 text-left transition-colors hover:bg-muted/50",
                activeConv === c.id && "bg-accent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(peerName(c))}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-card-foreground">{peerName(c)}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.last_message_content}</p>
                </div>
                {c.unread_count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{c.unread_count}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {!activeConv ? (
          <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="mb-3 h-12 w-12 opacity-30" />
            <p>Select a conversation</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m: any) => {
                const mine = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5", mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                      {!mine && <p className="mb-0.5 text-[10px] font-semibold opacity-70">{m.sender_name}</p>}
                      {m.content && <p className="text-sm">{m.content}</p>}
                      {m.image_url && <img src={m.image_url} alt="" className="mt-1 max-h-48 rounded-lg" />}
                      {m.video_url && <video src={m.video_url} controls className="mt-1 max-h-48 rounded-lg" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEnd} />
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
              <label className="cursor-pointer text-muted-foreground hover:text-foreground">
                <Paperclip className="h-5 w-5" />
                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message…" className="flex-1" />
              <Button type="submit" size="icon" disabled={sending || (!msg.trim() && !file)}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            {file && <p className="border-t border-border px-3 py-1 text-xs text-muted-foreground">📎 {file.name}</p>}
          </>
        )}
      </div>
    </div>
  );
}
