export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FILE_TYPE_ICONS: Record<string, string> = {
  "application/pdf": "📕",
  "application/msword": "📄",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "📄",
  "application/vnd.ms-excel": "📊",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
  "application/vnd.ms-powerpoint": "📽️",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "📽️",
  "image/png": "🖼️",
  "image/jpeg": "🖼️",
  "image/webp": "🖼️",
  "application/zip": "🗂️",
};

export function getFileTypeIcon(fileType: string): string {
  return FILE_TYPE_ICONS[fileType] ?? "📎";
}
