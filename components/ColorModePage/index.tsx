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
import PageBackButton from '../PageBackButton'
import MobileContainer from '../MobileContainer'

const LABEL_ID = 'appearance-label'

const ColorModePage = () => {
  const { update, setting } = useColorScheme()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as ColorSchemeSetting
    update(value)
  }

  return (
    <Page
      aboveTitleContent={
        <MobileContainer>
          <PageBackButton href="/settings">Settings</PageBackButton>
        </MobileContainer>
      }
      pageTitle="Appearance"
      renderPageTitle
      thinContainer
    >
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
