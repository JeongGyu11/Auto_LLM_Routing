import React, { useEffect, useState } from "react";
import {
  FrameWrapper,
  Header,
  LogoGroup,
  LogoImage,
  LogoText,
  MainContent,
  TitleText,
  SearchBox,
  SearchInnerBox,
  SearchInput,
  FooterContainer,
  FooterTextWrapper,
  FooterText,
} from "./MainpageStyle";

function App() {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("파일을 먼저 선택하세요!");
      return;
    }
    alert(`"${file.name}" 파일을 분석합니다...`);
    // TODO: 백엔드 연결 예시
    // const form = new FormData();
    // form.append("file", file);
    // await fetch("/api/analyze", { method: "POST", body: form });
  };

  useEffect(() => {
    document.title = " 최강 5조";
  }, []);

  return (
    <FrameWrapper>
      <Header>
        <LogoGroup>
          <LogoImage src="/logo192.png" alt="logo" />
          <LogoText>최강 5조</LogoText>
        </LogoGroup>
      </Header>

      <MainContent>
        <TitleText>분석할 파일을 업로드하세요</TitleText>

        <SearchBox>
          <SearchInnerBox>
            {/* 파일 업로드 inner박스*/}
            <label
              htmlFor="file-input"
              style={{
                padding: "10px 16px",
                background: "#f3f4f6",
                borderRadius: "10px",
                fontSize: "16px",
                color: "#333",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginRight: "12px",
              }}
            >
              파일 선택
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.hwp,.jpg,.png"
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <SearchInput
              as="div"
              style={{
                fontSize: "18px",
                color: file ? "#111827" : "#9ca3af",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file ? `선택된 파일: ${file.name}` : "PDF, HWP, JPG, PNG 파일을 선택하세요"}
            </SearchInput>

            <button
              onClick={handleAnalyze}
              style={{
                marginLeft: "12px",
                padding: "12px 18px",
                background:
                  "linear-gradient(90deg, #00f6ff 0%, #009499 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              분석하기
            </button>
          </SearchInnerBox>
        </SearchBox>
      </MainContent>

      <FooterContainer>
        <FooterTextWrapper>
          <FooterText>2025, in 명지대학교 공개SW실무 프로젝트 5조</FooterText>
          <FooterText>2025, Myongji University Open Source Software Practice Project Group 5</FooterText>
        </FooterTextWrapper>
      </FooterContainer>
    </FrameWrapper>
  );
}

export default App;
