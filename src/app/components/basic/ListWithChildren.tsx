import * as React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  box-sizing: border-box;
  height: 100%;
  overflow-x: auto;
  overflow-y: scroll;
  outline: none;
  position: relative;
  width: 100%;
`;

const Item = styled.div`
  box-sizing: border-box;
  overflow: none;
  outline: none;
  position: relative;
`;

export type ListProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The index of the selected item.
   * Set if this component should be controlled.
   */
  selectedIndex?: number;
  /**
   * Raised when the selected item changes.
   */
  onSelected?: (index: number) => void;
};

/**
 * A single selection list using PropsWithChildren
 */
export const ListWithChildren = (props: React.PropsWithChildren<ListProps>): JSX.Element => {
  const { className, selectedIndex: controlledSelectedIndex, onSelected, tabIndex = -1 } = props;
  const children = React.Children.toArray(props.children);

  const [selectedIndex, setSelectedIndex] = React.useState(controlledSelectedIndex ?? -1);

  React.useEffect(() => {
    const newChildren = React.Children.toArray(props.children);
    setSelectedIndex(Math.min(newChildren.length - 1, Math.max(0, selectedIndex)));
  }, [props.children]);

  React.useEffect(() => {
    // raise event when selection changes
    if (onSelected && (controlledSelectedIndex === undefined || controlledSelectedIndex !== selectedIndex)) {
      onSelected(selectedIndex);
    }
  }, [selectedIndex]);

  // handle controlledSelectedIndex changes
  React.useEffect(() => {
    if (controlledSelectedIndex !== undefined) {
      setSelectedIndex(controlledSelectedIndex);
    }
  }, [controlledSelectedIndex]);

  const selectPrevious = () => {
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const selectNext = () => {
    setSelectedIndex(Math.min(children.length - 1, selectedIndex + 1));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        selectPrevious();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        selectNext();
        break;
      default:
        break;
    }
  };

  const onItemClick = (_event: React.MouseEvent, index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Root {...props} tabIndex={tabIndex} className={className} onKeyDown={onKeyDown}>
      {children.map((child, index) => (
        <Item onClick={(e) => onItemClick(e, index)}>{child}</Item>
      ))}
    </Root>
  );
};
