"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import api from "@/lib/api"


interface FeedbackSectionProps {
    auctionId: string
    toUserId: string
    onFeedbackSubmitted?: () => void
}

export function FeedbackSection({ auctionId, toUserId, onFeedbackSubmitted }: FeedbackSectionProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please select a rating")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            await api.post("/feedback", {
                auctionId,
                toUserId,
                rating,
                comment
            })
            setIsSuccess(true)
            onFeedbackSubmitted?.()
        } catch (err: any) {
            console.error("Feedback submit error", err)
            setError(err.response?.data?.message || "Failed to submit feedback")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30 text-center">
                <div className="flex justify-center mb-2">
                    <Star className="w-10 h-10 text-green-500 fill-green-500" />
                </div>
                <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">Thank you!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                    Your feedback has been submitted successfully.
                </p>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white dark:bg-[#201d12] rounded-xl border border-gray-200 dark:border-[#37342a]">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Leave Feedback</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#b6b1a0] mb-2">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#b6b1a0] mb-2">Comment (Optional)</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#37342a] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-[#171612] dark:text-white"
                    rows={4}
                    placeholder="Describe your experience..."
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <Button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary-dark text-white"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
        </div>
    )
}
