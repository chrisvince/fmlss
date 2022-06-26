
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
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {options.map(({ label, value }) => (
        <li key={value}>
          <button
            onClick={handleOptionClick(value)}
            style={{
              backgroundColor: isSelected(value) ? 'pink' : undefined,
            }}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default SortSelector
