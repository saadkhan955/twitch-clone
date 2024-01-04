"use client"

import {
  ElementRef,
  useRef,
  useState,
  useTransition
} from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import Image from "next/image"

import { updateStream } from "@/actions/stream"
import { UploadDropzone } from "@/lib/uploadthing"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Hint } from "@/components/hint"

interface InfoModalProps {
  initialName: string
  initialThumbnailUrl: string | null
}

export const InfoModal = ({
  initialName,
  initialThumbnailUrl,
}: InfoModalProps) => {

  const router = useRouter()
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(initialName)
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(() => {
      updateStream({ name: name })
        .then(() => {
          toast.success("Stream info updated")
          closeRef?.current?.click()
        })
        .catch(() => toast.error("Failed to update stream info"))
    })
  }

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Stream thumbnail removed")
          setThumbnailUrl("")
          closeRef?.current?.click()
        })
        .catch(() => toast.error("Something went wrong"))
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit stream info
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>
              Name
            </Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Thumbnail
            </Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hint label="Remove Thumbnail" asChild side="left">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemove}
                      className="h-auto w-auto p-1.5"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone
                  endpoint="thumbnailUploader"
                  appearance={{
                    label: {
                      color: "#FFFFFF"
                    },
                    allowedContent: {
                      color: "#FFFFFF"
                    }
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url)
                    closeRef?.current?.click()
                    router.refresh()
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              variant="primary"
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}