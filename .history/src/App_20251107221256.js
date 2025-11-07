import React, { useEffect, useState } from "react";

const API_URL = 'https://mcp-api-server-yxey.onrender.com/api/process_document';

function App() {
  const [file, setFile] = useState(null);
  // 1. 사용자 요청 텍스트를 위한 상태 추가
  const [userRequest, setUserRequest] = useState(''); 
  // 2. Controller 태그 선택을 위한 상태 추가 (기본값 '분석')
  const [targetTag, setTargetTag] = useState('분석'); 
  // 3. 분석 결과를 표시할 상태 추가
  const [report, setReport] = useState('MCP 서버의 분석 결과가 여기에 표시됩니다.'); 
  // 4. 로딩 상태 추가
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };
  
  // 🚀 핵심: MCP 서버 연결 및 분석 실행 함수
  const handleAnalyze = async () => {
    if (loading) return;

    if (!file) {
      setReport("⚠️ 파일을 먼저 선택해야 합니다."); 
      return;
    }
    if (!userRequest.trim()) {
      setReport("⚠️ 요청 내용을 입력해야 합니다.");
      return;
    }

    setLoading(true);
    setReport(`'${file.name}' 파일을 [${targetTag}] 태그로 MCP 서버에 요청 전송 중...`);

    // FormData 생성: 파일, 요청 텍스트, 태그 포함
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_request', userRequest);
    formData.append('target_tag', targetTag);

    try {
      // 1. MCP 서버로 POST 요청 전송
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData, // FormData를 직접 전송
      });

      // 2. 응답 데이터 처리
      const data = await response.json();

      if (response.ok) {
        // 성공 시, 서버에서 받은 final_report를 결과창에 표시
        setReport(data.final_report || "✅ 분석이 성공적으로 완료되었으나, 서버가 보고서 내용을 반환하지 않았습니다.");
      } else {
        // 오류 처리 (4xx, 5xx)
        setReport(`❌ 오류 발생: ${data.detail || 'MCP 서버 응답 오류'}`);
        console.error("MCP 서버 오류 상세:", data);
      }
    } catch (error) {
      // 네트워크 오류 처리
      setReport(`🚨 네트워크 연결 오류: MCP 서버가 '${API_URL}' 주소에서 실행 중인지 확인하세요.`);
      console.error("네트워크 오류 상세:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "최강 5조 - MCP 멀티모달 분석";
  }, []);
  
  // 기존의 MainpageStyle 컴포넌트들을 대체하는 스타일 객체 (UI 유지를 위함)
  const styles = {
    FrameWrapper: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(180deg, rgba(235, 252, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)',
    },
    Header: {
      padding: '20px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    LogoGroup: {
      display: 'flex',
      alignItems: 'center',
    },
    LogoImage: {
      width: '30px',
      height: '30px',
      marginRight: '8px',
      // 로고 이미지 (임시로 아이콘 대체)
    },
    LogoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
    },
    MainContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    TitleText: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#009499',
      marginBottom: '40px',
      textAlign: 'center',
    },
    SearchBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '800px',
    },
    SearchInnerBox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%',
    },
    SearchInput: {
      flexGrow: 1,
      padding: '10px 12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#333',
      marginRight: '12px',
    },
    FooterContainer: {
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderTop: '1px solid #eee',
      marginTop: 'auto',
    },
    FooterTextWrapper: {
      textAlign: 'center',
    },
    FooterText: {
      fontSize: '12px',
      color: '#777',
      margin: '4px 0',
    },
    // 분석 결과 박스 스타일
    ResultBox: {
      width: '100%', 
      maxWidth: '800px', 
      marginTop: '30px', 
      padding: '20px', 
      backgroundColor: '#f0faff', 
      borderRadius: '16px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #009499'
    }
  };

  return (
    <div style={styles.FrameWrapper}>
      
      <header style={styles.Header}>
        <div style={styles.LogoGroup}>
          <img src="/logo192.png" alt="logo" style={styles.LogoImage} />
          <span style={styles.LogoText}>최강 5조</span>
        </div>
      </header>

      <main style={styles.MainContent}>
        <div style={styles.TitleText}>멀티모달 문서 분석 시스템</div>

        {/* --- 입력 영역 (파일, 요청, 태그, 버튼) --- */}
        <div style={styles.SearchBox}>
          
          {/* 1. 파일 업로드 섹션 */}
          <div style={styles.SearchInnerBox}>
            <label
              htmlFor="file-input"
              style={{
                padding: "10px 16px",
                background: "#009499",
                color: "white",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                marginRight: "12px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                fontWeight: 'bold',
              }}
            >
              파일 선택
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx,.txt,.jpg,.png"
              onChange={handleChange}
              style={{ display: "none" }}
            />
            {/* 선택된 파일 이름 표시 */}
            <div
              style={{
                ...styles.SearchInput,
                color: file ? "#111827" : "#9ca3af",
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0',
              }}
            >
              {file ? `선택된 파일: ${file.name}` : "PDF, DOCX, 이미지 파일을 선택하세요"}
            </div>
          </div>
          
          {/* 2. 사용자 요청 입력 섹션 */}
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              요청 내용 (Required)
            </label>
            <textarea
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              placeholder="예: '이 문서의 핵심 내용을 요약하고 전략적 시사점을 500자 이내로 작성해줘.'"
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* 3. 태그 선택 및 분석 버튼 섹션 */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Controller 태그 선택 */}
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <label style={{ marginRight: '10px', color: '#333' }}>
                Controller 태그:
              </label>
              <select
                value={targetTag}
                onChange={(e) => setTargetTag(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #009499',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="분석">분석 (Gemini Pro)</option>
                <option value="문체">문체/교정 (Gemini Flash)</option>
              </select>
            </div>

            {/* 분석하기 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                marginLeft: "12px",
                padding: "12px 24px",
                background: loading
                  ? "#9ca3af" 
                  : "linear-gradient(90deg, #00f6ff 0%, #009499 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: 'opacity 0.3s, transform 0.1s',
                opacity: loading ? 0.7 : 1,
                transform: loading ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              {loading ? '분석 중...' : '분석하기'}
            </button>
          </div>
        </div>
        
        {/* 4. 분석 결과 출력 영역 */}
        <div style={styles.ResultBox}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#009499', marginBottom: '15px', borderBottom: '1px dashed #009499', paddingBottom: '10px' }}>
            MCP 분석 결과 ({targetTag} 모듈 응답)
          </h2>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word', 
            fontSize: '14px', 
            lineHeight: '1.6', 
            color: '#333',
            minHeight: '100px',
            padding: '5px',
            backgroundColor: '#fff',
            borderRadius: '4px'
          }}>
            {report}
          </pre>
        </div>

      </main>

      <footer style={styles.FooterContainer}>
        <div style={styles.FooterTextWrapper}>
          <div style={styles.FooterText}>2025, in 명지대학교 공개SW실무 프로젝트 5조</div>
          <div style={styles.FooterText}>2025, Myongji University Open Source Software Practice Project Group 5</div>
        </div>
      </footer>
    </div>
  );
}

export default App;