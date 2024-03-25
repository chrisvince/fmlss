import { ImageRounded, LinkRounded } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { LegacyRef, ReactNode, useRef, useState } from 'react'
import UrlDialog from '../UrlDialog'
import { PostAttachmentInput } from '../../utils/draft-js/usePostBodyEditorState'

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
  disableUrlButton: boolean
  onUrlAdd: (postAttachmentInput: PostAttachmentInput) => void
}

const PostBodyActionBar = ({ disableUrlButton, onUrlAdd }: Props) => {
  const fileUploadRef = useRef<HTMLInputElement>()
  const [urlDialogOpen, setUrlDialogOpen] = useState(false)

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

  return (
    <>
      <Box
        sx={{ display: 'flex', gap: 0.4, ml: -0.8, justifyContent: 'flex-end' }}
      >
        <ItemButton onClick={handleUrlButtonClick} disabled={disableUrlButton}>
          <LinkRounded fontSize="small" titleAccess="URL" />
        </ItemButton>
        <ItemButton onClick={handleFileUploadClick}>
          <ImageRounded fontSize="small" />
          <input
            accept="image/*"
            hidden
            ref={fileUploadRef as LegacyRef<HTMLInputElement>}
            type="file"
          />
        </ItemButton>
      </Box>
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
