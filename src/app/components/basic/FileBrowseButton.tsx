import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { RegularButton } from './Button';

const FolderButton = styled(RegularButton)`  
  padding: 0;
`;

const FolderIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
  padding: 4px;
`;

type FileListItem = {
  path: string;
};
type HtmlFileInputElement = HTMLInputElement & {
  files?: FileListItem[];
};

type Props = {
  id: string;
  onChange: (filePath: string) => void;
};

export const FileBrowseButton = (props: Props): JSX.Element => {
  const { id, onChange } = props;

  const [inputValue, setInputValue] = React.useState<string | string[] | number | undefined>();

  const clearFileInput = () => {
    setInputValue('');
    setInputValue([]);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = (event?.currentTarget as any) as HtmlFileInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      onChange(fileInput.files[0].path);
    }

    clearFileInput();
  };

  return (
    <div>
      <input id={id} type='file' onChange={onFileChange} style={{ display: 'none' }} value={inputValue} />
      <FolderButton>
        <label htmlFor={id}>
          <FolderIcon icon={faFolderOpen} />
        </label>
      </FolderButton>
    </div>
  );
};
