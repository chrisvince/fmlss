import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

interface Props {
  adultContentChecked: boolean
  disabled?: boolean
  offensiveContentChecked: boolean
  onAdultContentChange: (checked: boolean) => void
  onOffensiveContentChange: (checked: boolean) => void
}

const PostContentOptions = ({
  adultContentChecked,
  disabled = false,
  offensiveContentChecked,
  onAdultContentChange,
  onOffensiveContentChange,
}: Props) => (
  <FormGroup
    sx={{
      columnGap: 2,
      display: 'flex',
      flexDirection: 'row',
    }}
  >
    <FormControlLabel
      componentsProps={{ typography: { variant: 'caption' } }}
      control={
        <Checkbox
          disabled={disabled}
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
          disabled={disabled}
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
