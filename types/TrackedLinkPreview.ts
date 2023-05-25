import { Match } from 'linkify-it'
import { PostPreview } from '.'

export interface TrackedLinkPreview {
  closed: boolean
  id: string
  inBody: boolean
  linkPreview: PostPreview
  match: Match
}
