import * as React from 'react';
import { useDebounce } from '../../useDebounceHook';
import styled from 'styled-components';
import { Input } from './Input';

const SearchInput = styled(Input)`
  min-width: 350px; 
`;

type Props = {
  initialText?: string;
  onChange: (searchText: string) => void;
  className?: string;
};

export const SearchBox = (props: Props) => {
  const { initialText = '', onChange, className } = props;

  const [searchText, setSearchText] = React.useState(initialText);

  const currentSearchText = useDebounce(searchText, 500);

  React.useEffect(() => {
    onChange(currentSearchText);
  }, [currentSearchText]);

  return (    
      <SearchInput className={className} type='text' value={searchText} placeholder='type to filter' onChange={event => setSearchText(event.currentTarget.value)}></SearchInput>    
  );
};