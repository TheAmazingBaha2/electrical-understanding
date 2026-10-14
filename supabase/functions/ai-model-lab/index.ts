// V3 retirement tombstone. No credentials, database, storage or provider dependencies.
// Deploy only to a separately authorized environment. Production retirement is pending.
Deno.serve((req: Request) => new Response(JSON.stringify({
  retired: true, ready: false, error: "Website lesson authoring and this legacy AI gateway are retired. No request was dispatched."
}), {status: 410, headers: {"Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"}}));
