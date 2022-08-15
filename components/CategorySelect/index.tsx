import { Autocomplete, TextField } from '@mui/material'
import { SyntheticEvent, useMemo, useState } from 'react'
import throttle from 'lodash.throttle'

import useCategoriesStartsWith from '../../utils/data/categories/useCategoriesStartsWith'
import { Category } from '../../types'
import constants from '../../constants'

const { CATEGORY_MAX_LENGTH } = constants

interface Props {
  id?: string
  onChange?: (value: string) => void
  onFocus?: (event: SyntheticEvent) => void
}

const CategorySelect = ({ id, onFocus, onChange }: Props) => {
  const [value, setValue] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const { categories, search } = useCategoriesStartsWith()

  const throttledSearch = useMemo(
    () =>
      throttle((searchString: string) => search(searchString), 800, {
        leading: false,
        trailing: true,
      }),
    [search]
  )

  const handleInput = async (
    _: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue)
    onChange?.(newInputValue)
    if (newInputValue.length < 2) return
    throttledSearch(newInputValue)
  }

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: Category | string | null
  ) => {
    const valueString =
      (typeof newValue === 'string' ? newValue : newValue?.data.name) ?? ''
    setValue(valueString)
  }

  return (
    <Autocomplete
      id={id}
      autoComplete
      filterOptions={x => x}
      filterSelectedOptions
      freeSolo
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.data.name
      }
      includeInputInList
      onFocus={onFocus}
      inputValue={inputValue}
      options={categories}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          inputProps={{
            ...params.inputProps,
            maxLength: CATEGORY_MAX_LENGTH,
          }}
          label="Category"
          variant="outlined"
        />
      )}
      value={value}
      onChange={handleChange}
      onInputChange={handleInput}
    />
  )
}

export default CategorySelect
