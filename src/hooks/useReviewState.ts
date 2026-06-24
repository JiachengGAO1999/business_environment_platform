import { useState, useEffect, useCallback } from 'react'
import type { ReviewAction } from '@/types'

const STORAGE_KEY = 'biz-platform-review-state'

interface StoredReview {
  reportId: string
  sectionId: string | null
  action: ReviewAction
  comment: string
  timestamp: string
}

function loadAllReviews(): StoredReview[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveAllReviews(reviews: StoredReview[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export function useReviewState(reportId: string) {
  const [reviews, setReviews] = useState<StoredReview[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const all = loadAllReviews()
    setReviews(all.filter((r) => r.reportId === reportId))
    setLoaded(true)
  }, [reportId])

  const addReview = useCallback(
    (sectionId: string | null, action: ReviewAction, comment: string) => {
      const newReview: StoredReview = {
        reportId,
        sectionId,
        action,
        comment,
        timestamp: new Date().toISOString(),
      }
      const all = loadAllReviews()
      all.push(newReview)
      saveAllReviews(all)
      setReviews((prev) => [...prev, newReview])
      return newReview
    },
    [reportId]
  )

  const getSectionReview = useCallback(
    (sectionId: string): StoredReview | undefined => {
      return reviews.find((r) => r.sectionId === sectionId)
    },
    [reviews]
  )

  const getOverallReview = useCallback((): StoredReview | undefined => {
    return reviews.find((r) => r.sectionId === null)
  }, [reviews])

  return { reviews, addReview, getSectionReview, getOverallReview, loaded }
}
