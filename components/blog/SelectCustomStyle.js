export const customStyle = {
  control: (base, state) => ({
    ...base,
    backgroundColor: '#6B6B6B',
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? 0 : 0,
    fontFamily: 'EB Garamond',
    color: '#fff',
    borderBottomLeftRadius: state.menuIsOpen ? '0px' : '4px',
    borderBottomRightRadius: state.menuIsOpen ? '0px' : '4px',
    cursor: 'pointer',
    '&:hover': {
      border: state.isFocused ? 0 : 0,
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#A5493A' : '#6B6B6B',
    color: '#fff',
    fontFamily: 'EB Garamond',
    cursor: 'pointer',
    border: 0,
    '&:hover': {
      backgroundColor: '#A5493A',
      color: '#fff',
    },
    '&:active': {
      backgroundColor: '#A5493A',
      color: '#fff',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
    backgroundColor: '#6B6B6B',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#1A1A1A',
    border: 0,
    boxShadow: 'none',
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#fff',
    },
  }),
}
