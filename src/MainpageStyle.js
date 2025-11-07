import styled from 'styled-components';

export const FrameWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #f3ffff 27%,
    #e9feff 71%,
    #c6fdff 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: 'Noto Sans KR', sans-serif;
`;

export const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px 60px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  width: 50px;
  height: auto;
  margin-right: 8px;
`;

export const LogoText = styled.div`
  font-size: 25px;
  font-weight: bold;
  color: #333;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -100px;
`;

export const TitleText = styled.h1`
  font-size: 50px;
  font-weight: 500;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #00f6ff, #009499);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  animation: floatText 3s ease-in-out infinite;

  @keyframes floatText {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

export const SearchBox = styled.div`
  padding: 3px;
  background: linear-gradient(90deg, #00f6ff, #009499);
  border-radius: 50px;
  display: flex;
  align-items: center;
  width: 700px;
  max-width: 90vw;
  height: 70px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
`;

export const SearchInnerBox = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50px;
  background: white;
  padding: 0 24px;
  width: 100%;
  height: 100%;
`;

export const GarlicIcon = styled.img`
  width: 55px;
  height: 55px;
  margin-right: 12px;
`;

export const SearchInput = styled.input`
  flex: 1;
  font-size: 21px;
  border: none;
  outline: none;
  background: transparent;
  color: #333;

  &::placeholder {
    color: #b5b5b5;
  }
`;

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const FooterContainer = styled.div`
  padding: 20px 0;
  text-align: center;
`;

export const FooterTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FooterText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;
