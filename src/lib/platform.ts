/**
 * Platform helpers that work both in a browser and inside a Capacitor
 * Android/iOS WebView. Capacitor plugins are detected at runtime through the
 * global bridge, so the web build carries no native dependency.
 */

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  Plugins?: Record<string, unknown>;
};

const cap = (): CapacitorGlobal | undefined =>
  typeof window === "undefined"
    ? undefined
    : (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;

export const isNativeApp = (): boolean => Boolean(cap()?.isNativePlatform?.());

const plugin = <T,>(name: string): T | undefined => cap()?.Plugins?.[name] as T | undefined;

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });

function browserDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Saves a file. On Android the blob is written to app storage with the
 * Filesystem plugin and offered through the native share sheet, because
 * `<a download>` is a no-op inside a WebView.
 */
export async function saveBlob(filename: string, blob: Blob): Promise<"native" | "browser"> {
  if (isNativeApp()) {
    const fs = plugin<{
      writeFile: (o: {
        path: string;
        data: string;
        directory: string;
        recursive?: boolean;
      }) => Promise<{ uri: string }>;
    }>("Filesystem");
    const share = plugin<{
      share: (o: { title?: string; url?: string; dialogTitle?: string }) => Promise<unknown>;
    }>("Share");
    if (fs) {
      const data = await blobToBase64(blob);
      const written = await fs.writeFile({
        path: filename,
        data,
        directory: "CACHE",
        recursive: true,
      });
      if (share) await share.share({ title: filename, url: written.uri, dialogTitle: filename });
      return "native";
    }
  }
  browserDownload(filename, blob);
  return "browser";
}

/** Share text (and optionally a file) using the native sheet, Web Share, or clipboard. */
export async function shareContent(opts: {
  title: string;
  text: string;
  file?: { filename: string; blob: Blob };
}): Promise<"shared" | "copied" | "cancelled"> {
  if (isNativeApp()) {
    const share = plugin<{ share: (o: Record<string, unknown>) => Promise<unknown> }>("Share");
    if (share) {
      try {
        await share.share({ title: opts.title, text: opts.text, dialogTitle: opts.title });
        return "shared";
      } catch {
        return "cancelled";
      }
    }
  }

  if (opts.file && typeof navigator !== "undefined" && navigator.canShare) {
    const file = new File([opts.file.blob], opts.file.filename, { type: opts.file.blob.type });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ title: opts.title, text: opts.text, files: [file] });
        return "shared";
      } catch {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: opts.title, text: opts.text });
      return "shared";
    } catch {
      return "cancelled";
    }
  }

  try {
    await navigator.clipboard.writeText(opts.text);
    return "copied";
  } catch {
    return "cancelled";
  }
}

/**
 * Printing: Android WebViews have no print dialog reachable from
 * `window.print()` in every configuration, so the caller can supply a PDF
 * fallback that is shared/saved instead.
 */
export async function printOrFallback(fallback?: () => Promise<void> | void): Promise<void> {
  if (!isNativeApp() && typeof window !== "undefined" && typeof window.print === "function") {
    window.print();
    return;
  }
  await fallback?.();
}
