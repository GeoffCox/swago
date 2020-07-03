import * as React from 'react';
import styled, { css } from 'styled-components';

const fullDivCss = css`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
  outline: none;
  position: relative;
`;

const Root = styled.div`
  ${fullDivCss}
  overflow-x: auto;
  overflow-y: scroll;
`;

const MeasureRef = styled.div``;

const Item = styled.div`
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  outline: none;
  position: relative;
`;

type ListItemKey = string | number | undefined;

export type RenderListItemProps<T> = {
  item: T;
  selected: boolean;
};

export type ListProps<T> = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The items to display.
   * If getKey is not defined, any defined item.key will be used.
   */
  items: readonly T[];

  /**
   * The callback to render each item.
   */
  renderItem: (props: RenderListItemProps<T>) => JSX.Element;

  /**
   * The optional method to get the key for an item.
   * If defined, item.key is ignored.
   */
  getKey?: (item: T) => ListItemKey;

  /**
   * The index of the selected item.
   * Set if this component should be controlled.
   */
  selectedIndex?: number;

  /**
   * The the selected item.
   * Set if this component should be controlled.
   */
  selectedItem?: T;

  /**
   * Raised when the selected item changes.
   */
  onSelected?: (item: T, index: number) => void;
};

/**
 * A single selection list
 */
export const List = <T extends any>(props: ListProps<T>): JSX.Element => {
  const {
    className,
    getKey,
    items,
    renderItem,
    selectedItem: controlledSelectedItem,
    selectedIndex: controlledSelectedIndex,
    onSelected,
    tabIndex = -1,
  } = props;

  // -------------------- Hooks --------------------

  const [selectedIndex, setSelectedIndex] = React.useState(controlledSelectedIndex ?? -1);
  const [lastSelectedKey, setLastSelectedKey] = React.useState<ListItemKey>(undefined);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const scrollIntoView = (index: number) => {
    if (index !== -1 && rootRef.current) {
      rootRef.current.querySelector<HTMLElement>(`[data-list-item='${index}']`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  };

  React.useEffect(() => {
    setLastSelectedKey(selectedIndex !== -1 ? getItemKey(items[selectedIndex]) : undefined);
    onSelected && onSelected(items[selectedIndex], selectedIndex);
    scrollIntoView(selectedIndex);
  }, [selectedIndex]);

  React.useEffect(() => {
    if (controlledSelectedIndex !== undefined) {
      setSelectedIndex(controlledSelectedIndex);
    }
  }, [controlledSelectedIndex]);

  React.useEffect(() => {
    if (controlledSelectedItem === undefined) {
      setSelectedIndex(-1);
      return;
    }

    const key = getItemKey(controlledSelectedItem);
    const index = key ? items.findIndex((i) => getItemKey(i) === key) : -1;
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [controlledSelectedItem]);

  // when items change, try to restore the selection if the item still exists in the list
  React.useEffect(() => {
    if (lastSelectedKey) {
      const restoreIndex = items.findIndex((i) => getItemKey(i) === lastSelectedKey);
      setSelectedIndex(restoreIndex);
    }
  }, [items]);

  // -------------------- Behavior --------------------

  const selectPrevious = () => {
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const selectNext = () => {
    setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        selectPrevious();
        break;
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

  // -------------------- Render --------------------

  const getItemKey = (value: T) => {
    if (getKey) {
      return getKey(value);
    }
    const valueWithKey = value as { key?: string | number };
    if (valueWithKey.key) {
      return valueWithKey.key;
    }

    return undefined;
  };

  return (
    <Root {...props} tabIndex={tabIndex} className={className} onKeyDown={onKeyDown}>
      <MeasureRef ref={rootRef}>
        {items.map((item, index) => (
          <Item key={getItemKey(item)} data-list-item={`${index}`} onClick={(e) => onItemClick(e, index)}>
            {renderItem({ item, selected: index === selectedIndex })}
          </Item>
        ))}
      </MeasureRef>
    </Root>
  );
};
