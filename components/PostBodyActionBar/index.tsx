import { ImageRounded, LinkRounded } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { LegacyRef, ReactNode, useRef, useState } from 'react'
import UrlDialog from '../UrlDialog'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'
import useFileUpload from '../../utils/data/media/useFileUpload'
import CircularProgressWithLabel from '../CircularProgressWithLabel'
import { MediaInputItem } from '../../types/MediaInputItem'
import useVideoUpload from '../../utils/useVideoUpload'

const ItemButton = ({
  children,
  disabled,
  onClick,
}: {
  children?: ReactNode
  disabled?: boolean
  onClick?: () => void
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      minWidth: 0,
      padding: 0.8,
      color: 'action.active',
    }}
  >
    {children}
  </Button>
)

interface Props {
  disableMediaButton: boolean
  disableUrlButton: boolean
  onUrlAdd: (postAttachmentInput: PostAttachmentInput) => void
  onFileUploaded: (mediaItem: MediaInputItem) => void
}

const PostBodyActionBar = ({
  disableMediaButton,
  disableUrlButton,
  onFileUploaded,
  onUrlAdd,
}: Props) => {
  const fileUploadRef = useRef<HTMLInputElement>()
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)
  const {
    error: imageUploadError,
    isError: isImageUploadError,
    upload: uploadImage,
    uploadInProgress: imageUploadInProgress,
    uploadProgress: imageUploadProgress,
  } = useFileUpload({ onFileUploaded })

  const {
    error: videoUploadError,
    isError: isVideoUploadError,
    progress: videoUploadProgress,
    upload: uploadVideo,
    uploading: videoUploadInProgress,
  } = useVideoUpload({ onUploadComplete: onFileUploaded })

  const error = imageUploadError || videoUploadError
  const isError = isImageUploadError || isVideoUploadError
  const uploadProgress = imageUploadProgress || videoUploadProgress
  const uploadInProgress = imageUploadInProgress || videoUploadInProgress

  const handleConfirm = (postAttachmentInput: PostAttachmentInput) => {
    onUrlAdd(postAttachmentInput)
    setUrlDialogOpen(false)
  }

  const handleUrlButtonClick = () => {
    if (urlDialogOpen) {
      return
    }
    setUrlDialogOpen(true)
  }

  const handleFileUploadClick = () => {
    fileUploadRef.current?.click()
  }

  const handleMediaChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.type.includes('image/')) {
      uploadImage(file)
      return
    }

    if (file.type.includes('video/')) {
      uploadVideo(file)
      return
    }

    throw new Error('Unsupported file type.')
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', gap: 0.4, ml: -0.8, justifyContent: 'flex-end' }}
      >
        <ItemButton onClick={handleUrlButtonClick} disabled={disableUrlButton}>
          <LinkRounded fontSize="small" titleAccess="URL" />
        </ItemButton>
        {!uploadInProgress ? (
          <ItemButton
            disabled={disableMediaButton}
            onClick={handleFileUploadClick}
          >
            <ImageRounded fontSize="small" />
            <input
              accept="image/*, video/*"
              hidden
              onChange={handleMediaChange}
              ref={fileUploadRef as LegacyRef<HTMLInputElement>}
              type="file"
            />
          </ItemButton>
        ) : (
          <CircularProgressWithLabel
            percentage={uploadProgress}
            size={34.22}
            fontSize={10}
            variant={
              videoUploadInProgress && uploadProgress === 0
                ? 'indeterminate'
                : 'determinate'
            }
          />
        )}
      </Box>
      {isError && (
        <Typography color="error.main" variant="caption">
          {error}
        </Typography>
      )}
      <UrlDialog
        open={urlDialogOpen}
        onClose={() => setUrlDialogOpen(false)}
        onCancel={() => setUrlDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default PostBodyActionBar
