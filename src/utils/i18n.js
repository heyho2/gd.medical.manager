// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  const hasKey = title

  if (hasKey) {
    const translatedTitle =  title

    return translatedTitle
  }
  return title
}
