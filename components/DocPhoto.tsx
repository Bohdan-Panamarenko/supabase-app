import { SyntheticEvent, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

interface IdPhotoProps {
  url: string,
  size: number,
  onUpload: (path: string) => void
}

export default function DocPhoto(props: IdPhotoProps) {
  const [docUrl, setDocUrl] = useState<string | undefined>(undefined)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (props.url) downloadImage(props.url)
  }, [props.url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('docs').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setDocUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }


  async function uploadDoc(event: SyntheticEvent) {
    try {
      setUploading(true)

      const target = event.target as HTMLInputElement;

      if (!target.files || target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('docs')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }
      console.log(filePath)
      props.onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {docUrl ? (
        <img
          src={docUrl}
          alt="Document"
          className="document image"
          style={{ height: props.size, width: props.size }}
        />
      ) : (
        <div className="document no-image" style={{ height: props.size, width: props.size }} />
      )}
      <div style={{ width: props.size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadDoc}
          disabled={uploading}
        />
      </div>
    </div>
  )
}