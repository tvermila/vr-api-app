import React from 'react'
import { Input, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const SearchField = ({ handleEntryChange, suggestions, entry, clearEntry }) => {
  return (
    <div>
      <strong>Hae aseman nimellä:</strong><br />
      <Input
        name='entry'
        size='large'
        icon={entry.length > 0 ? 'delete' : 'search'}
        placeholder='Aseman nimi...'
        onChange={handleEntryChange}
        autoFocus
        list='stations'
        value={entry}
        action={<Button onClick={clearEntry} />}
      />
      <datalist id='stations'>
        {suggestions.map((s, i) => <option value={s.stationName} key={i} />)}
      </datalist>
    </div>
  )
}

SearchField.propTypes = {
  handleEntryChange: PropTypes.func,
  suggestions: PropTypes.array,
  entry: PropTypes.string,
  clearEntry: PropTypes.func
}

export default SearchField