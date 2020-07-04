import * as React from 'react';
import styled, { css } from 'styled-components';
import { List, RenderListItemProps } from './List';

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
`;

// -------------------- Tree Item --------------------

type TreeItemKey = string | number | undefined;

export type TreeItem<T extends TreeItem<T>> = {
  readonly children: readonly T[];
};

export type RenderTreeItemProps<T extends TreeItem<T>> = {
  item: T;
  level: number;
  expanded: boolean;
  selected: boolean;
  expandCollapse: (expand?: boolean) => void;
};

type FlatTreeItem<T extends TreeItem<T>> = {
  item: T;
  key: TreeItemKey;
  level: number;
};

// -------------------- Tree --------------------

export type TreeProps<T extends TreeItem<T>> = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The tree items to display.
   * If getKey is not defined, any defined item.key will be used.
   */
  items: readonly T[];

  /**
   * The callback to render each item.
   */
  renderItem: (props: RenderTreeItemProps<T>) => JSX.Element;

  /**
   * The optional method to get the key for an item.
   * If defined, item.key is ignored.
   */
  getKey?: (item: T) => TreeItemKey;

  /**
   * The the selected item.
   * Set if this component should be controlled.
   */
  selectedItem?: T;

  /**
   * Raised when the selected item changes.
   */
  onSelected?: (item: T, index: number) => void;

  /**
   * If the tree should be expanded.
   */
  initiallyExpanded?: boolean;
};

/**
 * A single selection tree presented by flattening to a list
 */
export const Tree = <T extends TreeItem<T>>(props: TreeProps<T>): JSX.Element => {
  const { items, getKey, renderItem, className, onSelected, tabIndex = -1, initiallyExpanded } = props;

  // -------------------- Hooks --------------------

  const [expandCollapseItems, setExpandCollapseItems] = React.useState<TreeItemKey[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<FlatTreeItem<T>>();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  React.useEffect(() => {
    setExpandCollapseItems([]);
  }, [initiallyExpanded]);

  // -------------------- Behavior --------------------

  // semantic variables to make the logic clear
  const expandedItems = expandCollapseItems;
  const setExpandedItems = setExpandCollapseItems;
  const collapsedItems = expandCollapseItems;
  const setCollapsedItems = setExpandCollapseItems;

  const isExpanded = (key: TreeItemKey) => {
    if (initiallyExpanded) {
      return collapsedItems.indexOf(key) === -1;
    } else {
      return expandedItems.indexOf(key) !== -1;
    }
  };

  const expandCollapse = (key: TreeItemKey, expand?: boolean) => {
    if (key) {
      const index = expandCollapseItems.indexOf(key);

      if (initiallyExpanded) {
        if (index !== -1 && (expand === undefined || expand === true)) {
          collapsedItems.splice(index, 1);
          setCollapsedItems(expandCollapseItems.slice());
        } else if (index === -1 && (expand === undefined || expand === false)) {
          collapsedItems.push(key);
          setCollapsedItems(expandCollapseItems.slice());
        }
      } else {
        if (index === -1 && (expand === undefined || expand === true)) {
          expandedItems.push(key);
          setExpandedItems(expandedItems.slice());
        } else if (index !== -1 && (expand === undefined || expand === false)) {
          expandCollapseItems.splice(index, 1);
          setExpandedItems(expandedItems.slice());
        }
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        if (selectedItem) {
          if (isExpanded(selectedItem.key)) {
            expandCollapse(selectedItem.key, false);
          } else {
            setSelectedIndex(Math.max(0, selectedIndex - 1));
          }
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        event.stopPropagation();
        selectedItem && expandCollapse(selectedItem.key, true);
        break;
      default:
        break;
    }
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

  const flattenTree = (item: T, level: number, flatItems: FlatTreeItem<T>[]) => {
    const key = getItemKey(item);
    flatItems.push({ item, key, level });
    if (key === undefined || isExpanded(key)) {
      item.children.forEach((child) => flattenTree(child, level + 1, flatItems));
    }
  };

  const flatItems: FlatTreeItem<T>[] = [];
  items.forEach((item) => flattenTree(item, 0, flatItems));

  const renderListItem = (listItemProps: RenderListItemProps<FlatTreeItem<T>>) => {
    const { item: flatItem } = listItemProps;
    const { item, level, key } = flatItem;

    return renderItem({
      item,
      level,
      selected: listItemProps.selected,
      expanded: key !== undefined && isExpanded(key),
      expandCollapse: (expand) => expandCollapse(listItemProps.item.key, expand),
    });
  };

  const onListItemSelected = (flatItem: FlatTreeItem<T>, index: number) => {
    setSelectedItem(flatItem);
    setSelectedIndex(index);
    //TODO: handle undefined case by reversing params
    onSelected && flatItem?.item && onSelected(flatItem.item, index);
  };

  return (
    <Root {...props} tabIndex={tabIndex} className={className} onKeyDown={onKeyDown}>
      <List items={flatItems} renderItem={renderListItem} selectedIndex={selectedIndex} onSelected={onListItemSelected} />
    </Root>
  );
};
