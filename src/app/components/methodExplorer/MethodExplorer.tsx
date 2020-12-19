import * as React from "react";
import styled, { css } from "styled-components";
import { MethodCard } from "./MethodCard";
import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchBox } from "../basic/SearchBox";
import { RegularButton } from "../basic/Button";
import { Split } from "@geoffcox/react-splitter";
import { Tree, RenderTreeItemProps } from "../basic/Tree";
import { MethodTreeItem } from "./MethodTreeItem";
import { List, RenderListItemProps } from "../basic/List";
import { MethodListItem } from "./MethodListItem";
import { SwagoMethod } from "../../models/types";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import { selectedMethodPathState } from "../../models/atoms";
import { selectedMethodSelector } from "../../models/selectors";

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
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header" "content" "footer";
`;

const Header = styled.div`
  grid-area: header;
  background: linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px,
    linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px,
    linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px,
    linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px,
    linear-gradient(90deg, #1b1b1b 10px, transparent 10px),
    linear-gradient(
      #1d1d1d 25%,
      #1a1a1a 25%,
      #1a1a1a 50%,
      transparent 50%,
      transparent 75%,
      #242424 75%,
      #242424
    );
  background-color: #131313;
  background-size: 20px 20px;
  color: #ddd;
  border-top: 4px solid silver;
  padding: 10px;
  font-size: 18px;
`;

const Footer = styled.div`
  grid-area: footer;
  height: 1px;
`;

// -------------------- Path Tree | Path Details  --------------------

const LeftPane = styled.div`
  ${fullDivCss}
`;

const RightPane = styled.div`
  ${fullDivCss}
`;

// -------------------- Navigation (Left Pane) --------------------

const Navigation = styled.div`
  ${fullDivCss}
  display: grid;
  align-items: stretch;
  grid-template-columns: auto;
  grid-template-rows: [navRow1] auto [navRow2] 1fr;
`;

const CommandBar = styled.div`
  grid-row-start: navRow1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 10px;
`;

const FilterBox = styled(SearchBox)`
  margin: 0 0 0 4px;
  flex: 1 1 100%;
`;

const ExpandCollapseButton = styled(RegularButton)`
  margin: 0 1px 0 1px;
  transform: scaleX(-1);
`;

const SearchResults = styled.div.attrs(
  ({ searchActive }: { searchActive: boolean }): any => ({
    display: searchActive ? "block" : "none",
  })
)`
  ${fullDivCss}
  height: auto;
  display: ${(props) => props.display};
`;

// -------------------- Details (Right Pane) --------------------

const PathDetails = styled.div`
  ${fullDivCss}
`;

// -------------------- Path Exploerer --------------------

type Props = {
  methods: readonly SwagoMethod[];
};

const filterPaths = (
  item: SwagoMethod,
  filter: (item: SwagoMethod) => boolean,
  matches: SwagoMethod[]
) => {
  if (filter(item)) {
    matches.push(item);
  }
  item.children.forEach((child) => filterPaths(child, filter, matches));
};

type PathFilter = (item: SwagoMethod) => boolean;

const hasOpsFilter: PathFilter = (item: SwagoMethod) =>
  item ? item.operations.filter((o) => o.operation).length > 0 : false;

const createSearchFilters = (searchText: string): PathFilter[] => {
  return searchText
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => {
      const searchRegExp = new RegExp(t, "i");
      return (item: SwagoMethod) => searchRegExp.test(item.path);
    });
};

export const MethodExplorer = (props: Props): JSX.Element => {
  const { methods } = props;

  // -------------------- Hooks --------------------

  const selectedItem = useRecoilValue(selectedMethodSelector);
  const setSelectedMethodPath = useSetRecoilState(selectedMethodPathState);

  const [searchText, setSearchText] = React.useState("");
  const [searchMatches, setSearchMatches] = React.useState<SwagoMethod[]>();
  const [
    selectedSearchItem,
    setSelectedSearchItem,
  ] = React.useState<SwagoMethod>();

  const searchActive = searchText !== undefined && searchText.trim().length > 0;

  const [treeExpanded, setTreeExpanded] = React.useState(true);

  React.useEffect(() => {
    if (methods && searchActive) {
      const filters = createSearchFilters(searchText);
      filters.push(hasOpsFilter);
      const filter = (item: SwagoMethod) => filters.every((f) => f(item));

      const matches: SwagoMethod[] = [];
      methods.forEach((method) => filterPaths(method, filter, matches));
      setSearchMatches(matches);
    }
  }, [methods, searchText]);

  // -------------------- Render --------------------
  const items = methods ?? [];
  const getKey = (item: SwagoMethod) => item.path;

  const renderSearchItem = (itemProps: RenderListItemProps<SwagoMethod>) => {
    return (
      <MethodListItem method={itemProps.item} selected={itemProps.selected} />
    );
  };

  const renderTreeItem = (itemProps: RenderTreeItemProps<SwagoMethod>) => {
    return (
      <MethodTreeItem
        method={itemProps.item}
        level={itemProps.level}
        expanded={itemProps.expanded}
        expandCollapse={itemProps.expandCollapse}
        selected={itemProps.selected}
        hasChildren={itemProps.item.children.length > 0}
      />
    );
  };

  const onSelected = (item?: SwagoMethod) => {
    setSelectedMethodPath(item?.path);
  };

  const selectedDetails = searchActive ? selectedSearchItem : selectedItem;

  return (
    <Root>
      <Header>Methods</Header>
      <Split initialPrimarySize="35%" resetOnDoubleClick>
        <LeftPane>
          <Navigation>
            <CommandBar>
              <FilterBox onChange={setSearchText} />
              {methods && (
                <>
                  <ExpandCollapseButton
                    title="collapse all"
                    onClick={() => setTreeExpanded(false)}
                  >
                    <FontAwesomeIcon icon={faCompressAlt} />
                  </ExpandCollapseButton>
                  <ExpandCollapseButton
                    title="expand all"
                    onClick={() => setTreeExpanded(true)}
                  >
                    <FontAwesomeIcon icon={faExpandAlt} />
                  </ExpandCollapseButton>
                </>
              )}
            </CommandBar>
            <SearchResults searchActive={searchActive === false}>
              <Tree
                items={items}
                renderItem={renderTreeItem}
                getKey={getKey}
                selectedItem={selectedItem}
                onSelected={onSelected}
                initiallyExpanded={treeExpanded}
              />
            </SearchResults>
            <SearchResults searchActive={searchActive === true}>
              <List
                items={searchMatches ?? []}
                renderItem={renderSearchItem}
                selectedItem={selectedSearchItem}
                onSelected={setSelectedSearchItem}
                getKey={getKey}
              />
            </SearchResults>
          </Navigation>
        </LeftPane>
        <RightPane>
          <PathDetails>
            {selectedDetails && <MethodCard method={selectedDetails} />}
          </PathDetails>
        </RightPane>
      </Split>
      <Footer />
    </Root>
  );
};
