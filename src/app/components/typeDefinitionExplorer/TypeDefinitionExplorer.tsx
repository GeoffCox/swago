import * as React from "react";
import styled, { css } from "styled-components";
import { SearchBox } from "../basic/SearchBox";
import { TypeDefinitionCard } from "./TypeDefinitionCard";
import { Split } from "@geoffcox/react-splitter";
import { TypeDefinitionListItem } from "./TypeDefinitionListItem";
import { List, RenderListItemProps } from "../basic/List";
import { SwagoTypeDefinition } from "../../models/types";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import { selectedTypeDefinitionSelector } from "../../models/selectors";
import { selectedTypeDefinitionRefState } from "../../models/atoms";

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
  grid-template-rows: auto 1fr;
  grid-template-areas: "header" "content";
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
  padding: 10px;
  font-size: 18px;
`;

// -------------------- Navigation (Left Pane) --------------------

const Navigation = styled.div`
  height: 100%;
  overflow: hidden;
  display: grid;
  align-items: stretch;
  grid-template-columns: auto;
  grid-template-rows: [navRow1] auto [navRow2] 1fr [navRow3] 1px;
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

// const StyledList = styled(List)`
//   border-top: 1px solid #ccc;
// `;

// -------------------- Details (Right Pane) --------------------

const TypeDetails = styled.div`
  ${fullDivCss}
`;

// -------------------- Type Definition Explorer --------------------

type Props = {
  typeDefinitions: readonly SwagoTypeDefinition[];
};

export const TypeDefinitionExplorer = (props: Props): JSX.Element => {
  const { typeDefinitions } = props;

  const [searchText, setSearchText] = React.useState("");
  const selectedTypeDefinition = useRecoilValue(selectedTypeDefinitionSelector);
  const setSelectedTypeDefinitionRef = useSetRecoilState(
    selectedTypeDefinitionRefState
  );

  const [items, setItems] = React.useState(typeDefinitions);

  React.useEffect(() => {
    let filter = (_item: SwagoTypeDefinition) => true;
    if (searchText && searchText.trim().length > 0) {
      const searchRegExp = new RegExp(searchText.trim(), "i");
      filter = (item: SwagoTypeDefinition) => searchRegExp.test(item.name);
    }

    const newItems = typeDefinitions.filter(filter);
    setItems(newItems);
  }, [typeDefinitions, searchText]);

  const getKey = (item: SwagoTypeDefinition) => item.name;

  const renderListItem = (
    itemProps: RenderListItemProps<SwagoTypeDefinition>
  ) => {
    return (
      <TypeDefinitionListItem
        typeDefinition={itemProps.item}
        selected={itemProps.selected}
      />
    );
  };

  const onSelected = (item: SwagoTypeDefinition) => {
    item && setSelectedTypeDefinitionRef(item.$ref);
  };

  return (
    <Root>
      <Header>Types</Header>
      <Split initialPrimarySize={"35%"} resetOnDoubleClick>
        <Navigation>
          <CommandBar>
            <FilterBox onChange={setSearchText} />
          </CommandBar>
          <List
            getKey={getKey}
            items={items}
            renderItem={renderListItem}
            selectedItem={selectedTypeDefinition}
            onSelected={onSelected}
          />
        </Navigation>
        <TypeDetails>
          {selectedTypeDefinition && (
            <TypeDefinitionCard typeDefinition={selectedTypeDefinition} />
          )}
        </TypeDetails>
      </Split>
    </Root>
  );
};
