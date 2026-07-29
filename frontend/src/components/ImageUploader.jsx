import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '../api/misc.js'
import { getErrorMessage } from '../api/axios.js'

const MAX_SIZE_MB = 5

export default function ImageUploader({ value, onChange, label = 'Cover image' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    setUploading(true)
    setProgress(0)
    try {
      const res = await uploadImage(file, setProgress)
      onChange(res.data.url)
      toast.success('Image uploaded')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Image upload failed.'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <div
        className="relative flex min-h-[180px] flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed border-paper-line/30 bg-canvas-panel text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        {value ? (
          <>
            <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-canvas/90 text-paper hover:text-rust"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <Loader2 className="h-6 w-6 animate-spin text-brass" />
            <p className="font-mono text-xs text-muted">Uploading… {progress}%</p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 py-10 text-muted transition-colors hover:text-brass"
          >
            <ImagePlus className="h-7 w-7" strokeWidth={1.5} />
            <span className="text-sm">Drop an image, or click to browse</span>
            <span className="font-mono text-[11px] text-muted/70">JPG or PNG, up to {MAX_SIZE_MB}MB</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {value && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-brass hover:underline"
        >
          Replace image
        </button>
      )}
    </div>
  )
}
