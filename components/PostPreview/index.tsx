import dynamic from 'next/dynamic'
import { PostPreview as PostPreviewType } from '../../types'

const PostPreviewFacebook = dynamic(() => import('../PostPreviewFacebook'))
const PostPreviewInstagram = dynamic(() => import('../PostPreviewInstagram'))
const PostPreviewMeta = dynamic(() => import('../PostPreviewMeta'))
const PostPreviewPinterest = dynamic(() => import('../PostPreviewPinterest'))
const PostPreviewTikTok = dynamic(() => import('../PostPreviewTikTok'))
const PostPreviewTwitter = dynamic(() => import('../PostPreviewTwitter'))
const PostPreviewYouTube = dynamic(() => import('../PostPreviewYouTube'))

interface Props {
  isAboveFold?: boolean
  onClose?: () => void
  postPreview: PostPreviewType
}

const PostPreview = ({ isAboveFold = false, onClose, postPreview }: Props) => {
  if (postPreview.type === 'twitter') {
    return <PostPreviewTwitter onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'facebook') {
    return <PostPreviewFacebook onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'instagram') {
    return <PostPreviewInstagram onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'tiktok') {
    return <PostPreviewTikTok onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'youtube') {
    return <PostPreviewYouTube onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'pinterest') {
    return <PostPreviewPinterest onClose={onClose} postPreview={postPreview} />
  }

  if (postPreview.type === 'url') {
    return (
      <PostPreviewMeta
        isAboveFold={isAboveFold}
        onClose={onClose}
        postPreview={postPreview}
      />
    )
  }

  return null
}

export default PostPreview
