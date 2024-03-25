import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

interface Props {
  adultContentChecked: boolean
  offensiveContentChecked: boolean
  onAdultContentChange: (checked: boolean) => void
  onOffensiveContentChange: (checked: boolean) => void
}

const PostContentOptions = ({
  adultContentChecked,
  offensiveContentChecked,
  onAdultContentChange,
  onOffensiveContentChange,
}: Props) => (
  <FormGroup
    sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
    }}
  >
    <FormControlLabel
      componentsProps={{ typography: { variant: 'caption' } }}
      control={
        <Checkbox
          onChange={() => onOffensiveContentChange(!offensiveContentChecked)}
          size="small"
          value={offensiveContentChecked}
        />
      }
      label="Contains offensive content"
    />
    <FormControlLabel
      componentsProps={{ typography: { variant: 'caption' } }}
      control={
        <Checkbox
          onChange={() => onAdultContentChange(!adultContentChecked)}
          size="small"
          value={adultContentChecked}
        />
      }
      label="Contains adult content"
    />
  </FormGroup>
)

export default PostContentOptions
