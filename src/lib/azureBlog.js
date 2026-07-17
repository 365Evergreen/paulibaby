const BLOG_CONTAINER_URL = import.meta.env.VITE_AZURE_BLOG_CONTAINER_URL?.trim() ?? ''

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/\.json$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeParagraphs(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/\n{2,}/)
      .map((entry) => entry.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTags(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((tag) => String(tag).trim()).filter(Boolean)
}

function normalizePost(blobName, payload) {
  const baseName = blobName.split('/').pop() ?? blobName
  const fallbackTitle = baseName.replace(/\.json$/i, '').replace(/[-_]+/g, ' ')
  const paragraphs = normalizeParagraphs(payload.content ?? payload.body ?? payload.paragraphs)

  return {
    slug: String(payload.slug ?? toSlug(baseName)),
    title: String(payload.title ?? fallbackTitle),
    excerpt: String(payload.excerpt ?? paragraphs[0] ?? 'No summary provided yet.'),
    publishedAt: String(payload.publishedAt ?? payload.date ?? ''),
    author: String(payload.author ?? import.meta.env.VITE_SITE_OWNER ?? 'Pauli Baby'),
    tags: normalizeTags(payload.tags),
    paragraphs,
  }
}

function getContainerRoot(containerUrl) {
  const url = new URL(containerUrl)
  url.searchParams.delete('restype')
  url.searchParams.delete('comp')
  return url
}

async function listBlobNames(containerUrl) {
  const listUrl = new URL(containerUrl)
  listUrl.searchParams.set('restype', 'container')
  listUrl.searchParams.set('comp', 'list')

  const response = await fetch(listUrl)

  if (!response.ok) {
    throw new Error(`Unable to list blog posts (${response.status})`)
  }

  const xml = await response.text()
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  const parserError = document.querySelector('parsererror')

  if (parserError) {
    throw new Error('Azure Blob returned an unreadable listing response.')
  }

  return Array.from(document.querySelectorAll('Blob > Name'))
    .map((node) => node.textContent?.trim() ?? '')
    .filter((name) => name.endsWith('.json'))
}

async function fetchBlobJson(containerUrl, blobName) {
  const blobUrl = getContainerRoot(containerUrl)
  blobUrl.pathname = `${blobUrl.pathname.replace(/\/$/, '')}/${blobName}`

  const response = await fetch(blobUrl)

  if (!response.ok) {
    throw new Error(`Unable to load ${blobName} (${response.status})`)
  }

  return response.json()
}

function sortPosts(posts) {
  return [...posts].sort((left, right) => {
    const leftTime = Date.parse(left.publishedAt)
    const rightTime = Date.parse(right.publishedAt)

    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
      return left.title.localeCompare(right.title)
    }

    if (Number.isNaN(leftTime)) {
      return 1
    }

    if (Number.isNaN(rightTime)) {
      return -1
    }

    return rightTime - leftTime
  })
}

export function getBlogContainerUrl() {
  return BLOG_CONTAINER_URL
}

export async function fetchPosts() {
  if (!BLOG_CONTAINER_URL) {
    return []
  }

  const blobNames = await listBlobNames(BLOG_CONTAINER_URL)
  const posts = await Promise.all(
    blobNames.map(async (blobName) => normalizePost(blobName, await fetchBlobJson(BLOG_CONTAINER_URL, blobName))),
  )

  return sortPosts(posts)
}
