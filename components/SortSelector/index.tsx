import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'

interface PropTypes {
  options: {
    label: string
    value: string
  }[]
  onOptionClick: (value: string) => void
  currentSelection: string
}

const SortSelector = ({
  options = [],
  onOptionClick,
  currentSelection,
}: PropTypes) => {
  const handleOptionClick = (value: string) => () => onOptionClick(value)
  const isSelected = (value: string) => value === currentSelection

  return (
    <ButtonGroup
      aria-label="small button group"
      fullWidth
      size="small"
    >
      {options.map(({ label, value }) => (
        <Button
          key={value}
          onClick={handleOptionClick(value)}
          variant={isSelected(value) ? 'contained' : undefined}
          disableElevation
          disableFocusRipple
          disableRipple
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default SortSelector
