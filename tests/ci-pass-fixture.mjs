// Test-only fetch stub for the spawned build process; never shipped as an asset.
globalThis.fetch=async()=>({ok:true,json:async()=>({workflow_runs:[{id:1,head_sha:'a'.repeat(40),head_branch:'main',path:'.github/workflows/v2-checks.yml',event:'push',status:'completed',conclusion:'success'}]})});
