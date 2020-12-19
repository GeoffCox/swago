import * as React from "react";
import { FileBrowseButton } from "./basic/FileBrowseButton";
import { Split } from "@geoffcox/react-splitter";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { documentState } from "../models/atoms";
import { loadSwaggerDocument } from "../models/loader";
import { MethodExplorer } from "./methodExplorer/MethodExplorer";
import { TypeDefinitionExplorer } from "./typeDefinitionExplorer/TypeDefinitionExplorer";

// -------------------- Styles  --------------------

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Layout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  border: 5px solid silver;
  box-sizing: border-box;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 1px;
  grid-template-areas: "header" "content" "footer";
`;

const Footer = styled.div`
  grid-area: footer;
  min-height: 1px;
  background: transparent;
`;

const CommandBar = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
`;

const SwaggerFileInfo = styled.div`
  margin: 0 0 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

// -------------------- Main --------------------

export const Main = () => {
  const [document, setDocument] = useRecoilState(documentState);

  const onFileChanged = async (file: string) => {
    setDocument(await loadSwaggerDocument(file));
  };

  return (
    <Root>
      <Layout>
        <CommandBar>
          <FileBrowseButton id="swagger-file" onChange={onFileChanged} />
          <SwaggerFileInfo>
            {document && (
              <>
                <div title={document.version}>{document.title}</div>
                <div>{document.location}</div>
              </>
            )}
          </SwaggerFileInfo>
        </CommandBar>
        <Split
          horizontal
          resetOnDoubleClick
          initialPrimarySize={"50%"}
          minPrimarySize="45px"
          minSecondarySize="45px"
        >
          {document && document.methods && (
            <MethodExplorer methods={document.methods} />
          )}
          {document && document.typeDefinitions && (
            <TypeDefinitionExplorer
              typeDefinitions={document.typeDefinitions}
            />
          )}
        </Split>
        <Footer />
      </Layout>
    </Root>
  );
};
