export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ""

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
