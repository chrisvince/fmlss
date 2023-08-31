import { Autocomplete, TextField } from '@mui/material'
import { SyntheticEvent, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'

import useTopicsStartsWith from '../../utils/data/topics/useTopicsStartsWith'
import { Topic } from '../../types'
import constants from '../../constants'

const { TOPIC_MAX_LENGTH } = constants

interface Props {
  id?: string
  onChange?: (value: string) => void
  onFocus?: (event: SyntheticEvent) => void
}

const TopicSelect = ({ id, onFocus, onChange }: Props) => {
  const [value, setValue] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const { topics, search } = useTopicsStartsWith()

  const debouncedSearch = useMemo(
    () => debounce((searchString: string) => search(searchString), 1000),
    [search]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleInput = async (
    _: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue)
    onChange?.(newInputValue)
    if (newInputValue.length < 2) return
    debouncedSearch(newInputValue)
  }

  const handleChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: Topic | string | null
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
      options={topics}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          inputProps={{
            ...params.inputProps,
            maxLength: TOPIC_MAX_LENGTH,
          }}
          label="Topic"
          variant="outlined"
        />
      )}
      value={value}
      onChange={handleChange}
      onInputChange={handleInput}
    />
  )
}

export default TopicSelect
