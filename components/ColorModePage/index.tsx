import Page from '../Page'
import useColorScheme from '../../utils/useColorScheme'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { ColorSchemeSetting } from '../../types'

const LABEL_ID = 'appearance-label'

const ColorModePage = () => {
  const { value, update, setting } = useColorScheme()
  console.log(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as ColorSchemeSetting
    update(value)
  }

  return (
    <Page pageTitle="Appearance" thinContainer renderPageTitle>
      <FormControl>
        <FormLabel id={LABEL_ID} hidden>
          Appearance
        </FormLabel>
        <RadioGroup
          aria-labelledby={LABEL_ID}
          name="appearance-group"
          onChange={handleChange}
          value={setting}
        >
          {Object.keys(ColorSchemeSetting).map(key => {
            const value =
              ColorSchemeSetting[key as keyof typeof ColorSchemeSetting]

            return (
              <FormControlLabel
                key={key}
                value={value}
                control={<Radio />}
                label={key}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
    </Page>
  )
}

export default ColorModePage
