import { Typography } from '@mui/material'
import { EditorState, convertFromRaw } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import createLinkifyPlugin from '../../utils/draft-js/plugins/linkify'
import createHashtagPlugin from '../../utils/draft-js/plugins/hashtag'
import { useState } from 'react'
import createMentionPlugin from '../../utils/draft-js/plugins/mention'

const PLUGINS = [
  createMentionPlugin({ readOnly: true }),
  createLinkifyPlugin({ readOnly: true }),
  createHashtagPlugin({ readOnly: true }),
]

interface Props {
  body: string
  id?: string
  size?: 'small' | 'large'
}

const PostBody = ({ body, id, size = 'small' }: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromRaw(JSON.parse(body)))
  )

  const typographyVariant = ({
    large: 'body1',
    small: 'body2',
  }[size] ?? 'body2') as 'body1' | 'body2'

  return (
    <>
      <Typography component="div" id={id} variant={typographyVariant}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          plugins={PLUGINS}
          readOnly
        />
      </Typography>
    </>
  )
}

export default PostBody
