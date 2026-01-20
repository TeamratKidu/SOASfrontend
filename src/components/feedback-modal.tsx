import { useState } from "react"
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { feedbackService } from "@/services/feedback.service"
import { toast } from "sonner"

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    auctionId: string
    toUserId: string // The user being rated (winner or seller)
    toUserName?: string
    onSuccess?: () => void
}

export function FeedbackModal({ isOpen, onClose, auctionId, toUserId, onSuccess }: FeedbackModalProps) {
    const { t } = useTranslation()
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            await feedbackService.createFeedback({
                auctionId,
                toUserId,
                rating,
                comment,
            })
            toast.success(t("Feedback submitted successfully!"))
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            console.error("Failed to submit feedback", error)
            toast.error(t("Failed to submit feedback"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("Rate Experience", "ተሞክሮዎን ይግለጹ")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>{t("Rating", "ደረጃ")}</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button" // Prevent form submission if inside form
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="comment">{t("Comment (Optional)", "አስተያየት (አማራጭ)")}</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t("Share your experience...", "ተሞክሮዎን ያጋሩ...")}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        {t("Cancel", "ይቅር")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? t("Submitting...", "በመላክ ላይ...") : t("Submit Feedback", "አስተያየት ይላኩ")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
