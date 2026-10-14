// No privileged commands, plugins, production backend, updater or filesystem API.
fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("Unable to start Tauri evaluation");
}
