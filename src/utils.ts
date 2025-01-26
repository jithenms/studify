export const formatBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];

  if (bytes === 0) return "0 B";

  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = (bytes / Math.pow(1024, unitIndex)).toFixed(2);

  return `${formattedSize} ${units[unitIndex]}`;
};
