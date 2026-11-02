// Database writes are authoritative; optional spreadsheet exports never undo them.
export async function exportToSheets(urls: Array<string | undefined>, payload: unknown) {
  let success = true;
  for (const url of [...new Set(urls.filter(Boolean))] as string[]) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json() as { ok?: boolean; error?: unknown };
      if (result.ok === false || result.error) throw new Error('Sheet rejected export');
    } catch {
      success = false;
      console.error('Spreadsheet export failed; registration is saved in the CA database.');
    }
  }
  return success;
}
