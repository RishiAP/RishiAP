export function highlightJson(json: any): string {
  const jsonString = typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  return jsonString
    .replace(/"([^"]+)":/g, '<span class="text-indigo-300">"$1"</span>:')
    .replace(/: "(.*?)"/g, ': <span class="text-amber-200">"$1"</span>')
    .replace(/: (true|false|null|[0-9]+)/g, ': <span class="text-emerald-300">$1</span>');
}
