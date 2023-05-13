import dynamic from 'next/dynamic'
import {
  PostPreview as PostPreviewType,
  PostPreviewFacebook,
  PostPreviewInstagram,
  PostPreviewMeta,
  PostPreviewPinterest,
  PostPreviewTikTok,
  PostPreviewTwitter,
  PostPreviewYouTube,
} from '../../types'

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

const PostPreview = ({ isAboveFold = false, onClose, postPreview }: Props) =>
  ({
    twitter: () => (
      <PostPreviewTwitter
        onClose={onClose}
        postPreview={postPreview as PostPreviewTwitter}
      />
    ),
    facebook: () => (
      <PostPreviewFacebook
        onClose={onClose}
        postPreview={postPreview as PostPreviewFacebook}
      />
    ),
    instagram: () => (
      <PostPreviewInstagram
        onClose={onClose}
        postPreview={postPreview as PostPreviewInstagram}
      />
    ),
    tiktok: () => (
      <PostPreviewTikTok
        onClose={onClose}
        postPreview={postPreview as PostPreviewTikTok}
      />
    ),
    youtube: () => (
      <PostPreviewYouTube
        onClose={onClose}
        postPreview={postPreview as PostPreviewYouTube}
      />
    ),
    pinterest: () => (
      <PostPreviewPinterest
        onClose={onClose}
        postPreview={postPreview as PostPreviewPinterest}
      />
    ),
    url: () => (
      <PostPreviewMeta
        isAboveFold={isAboveFold}
        onClose={onClose}
        postPreview={postPreview as PostPreviewMeta}
      />
    ),
  }[postPreview.type]())

export default PostPreview
