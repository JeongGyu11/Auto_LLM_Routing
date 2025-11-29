import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { NotoSansKRRegular } from "./fonts/notoSansKR";

function App() {
  const [file, setFile] = useState(null);
  const [userRequest, setUserRequest] = useState("");
  const [targetTag, setTargetTag] = useState("분석");
  const [report, setReport] = useState("MCP 서버의 분석 결과가 여기에 표시됩니다.");
  const [loading, setLoading] = useState(false);
  const [canDownload, setCanDownload] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  // ==========================
  // 🔥 MCP WebSocket 분석 요청
  // ==========================
  const handleAnalyze = async () => {
    if (loading) return;

    if (!userRequest.trim()) {
      setReport("요청 내용을 입력해야 합니다.");
      setCanDownload(false);
      return;
    }

    setLoading(true);
    setCanDownload(false);
    setReport(`[${targetTag}] 태그로 MCP WebSocket 서버 요청 중...`);

    try {
      const ws = new WebSocket("wss://auto-llm-routing-server.onrender.com/mcp");

      ws.onopen = () => {
        console.log("WebSocket 연결됨");

        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "tools/invoke",
            params: {
              name: "generate_text",
              arguments: {
                input: userRequest,
                tag: targetTag 
              },
            },
          })
        );
      };

      ws.onerror = (err) => {
        console.error("WebSocket 오류:", err);
        setReport("WebSocket 연결 오류 발생. MCP 서버를 확인하세요.");
        setLoading(false);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("서버 응답:", data);

        if (data.result?.content) {
          setReport(data.result.content);
          setCanDownload(true);
        } else {
          setReport("MCP 서버 응답 오류 또는 빈 응답");
          setCanDownload(false);
        }
        setLoading(false);
        ws.close();
      };
    } catch (error) {
      setReport("네트워크 오류: MCP 서버 접속 실패");
      setCanDownload(false);
      console.error(error);
      setLoading(false);
    }
  };

  // ==========================
  // 📄 PDF 다운로드
  // ==========================
  const handleDownloadPDF = () => {
    if (!report || report === "MCP 서버의 분석 결과가 여기에 표시됩니다.") return;

    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    doc.addFileToVFS("NotoSansKR-Regular.ttf", NotoSansKRRegular);
    doc.addFont("NotoSansKR-Regular.ttf", "NotoSansKR", "normal");
    doc.setFont("NotoSansKR");

    const marginLeft = 15;
    const marginTop = 20;
    const maxLineWidth = 180;

    doc.setFontSize(16);
    doc.text("MCP 분석 결과 보고서", marginLeft, marginTop);

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const metaY = marginTop + 8;
    doc.text(`파일명: ${file ? file.name : "N/A"}`, marginLeft, metaY);
    doc.text(`Controller 태그: ${targetTag}`, marginLeft, metaY + 6);

    const plainReport = report.replace(/^###\s*/gm, "").replace(/\*\*/g, "");

    const lines = doc.splitTextToSize(plainReport, maxLineWidth);

    let cursorY = metaY + 20;
    const lineHeight = 6;

    lines.forEach((line) => {
      if (cursorY > 280) {
        doc.addPage();
        doc.setFont("NotoSansKR");
        doc.setFontSize(11);
        cursorY = marginTop;
      }
      doc.text(line, marginLeft, cursorY);
      cursorY += lineHeight;
    });

    const safeName = file?.name?.replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣_.-]/g, "_") || "report";
    doc.save(`MCP_분석결과_${safeName}.pdf`);
  };

  useEffect(() => {
    document.title = "최강 5조 - MCP 멀티모달 분석";
  }, []);

  // ==========================
  // 🎨 스타일
  // ==========================
  const styles = {
    FrameWrapper: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, #EBFCFF 0%, #FFFFFF 100%)",
      fontFamily: "Arial, sans-serif",
    },
    Header: {
      padding: "20px 40px",
      backgroundColor: "rgba(255,255,255,0.9)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    LogoGroup: { display: "flex", alignItems: "center" },
    LogoText: { marginLeft: 8, fontSize: "20px", fontWeight: "bold" },
    MainContent: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    },
    TitleText: {
      fontSize: "32px",
      fontWeight: "600",
      color: "#009499",
      marginBottom: "40px",
      textAlign: "center",
    },
    SearchBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "800px",
    },
    SearchInnerBox: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      width: "100%",
    },
    SearchInput: {
      flexGrow: 1,
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "16px",
    },
    ResultBox: {
      width: "100%",
      maxWidth: "800px",
      marginTop: "30px",
      padding: "20px",
      backgroundColor: "#f0faff",
      borderRadius: "16px",
      border: "2px solid #009499",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  };

  return (
    <div style={styles.FrameWrapper}>
      <header style={styles.Header}>
        <div style={styles.LogoGroup}>
          <img src="/logo192.png" alt="logo" width={30} height={30} />
          <span style={styles.LogoText}>최강 5조</span>
        </div>
      </header>

      <main style={styles.MainContent}>
        <div style={styles.TitleText}>멀티모달 문서 분석 시스템</div>

        {/* 입력 영역 */}
        <div style={styles.SearchBox}>
          <div style={styles.SearchInnerBox}>
            <label
              htmlFor="file-input"
              style={{
                padding: "10px 16px",
                background: "#009499",
                color: "white",
                borderRadius: "10px",
                cursor: "pointer",
                marginRight: "12px",
                fontWeight: "bold",
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

            <div
              style={{
                ...styles.SearchInput,
                color: file ? "#111827" : "#9ca3af",
                backgroundColor: "#f9f9f9",
              }}
            >
              {file ? `선택된 파일: ${file.name}` : "PDF, DOCX, 이미지 파일 선택 (선택사항)"}
            </div>
          </div>

          {/* 요청 입력 */}
          <div style={{ width: "100%", marginBottom: "20px" }}>
            <label style={{ marginBottom: "8px", fontWeight: "bold", color: "#333", display: "block" }}>
              요청 내용 (Required)
            </label>
            <textarea
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                resize: "vertical",
              }}
              placeholder="예: '이 문서의 핵심 내용을 요약해줘.'"
            />
          </div>

          {/* 버튼 */}
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
              <label style={{ marginRight: "10px" }}>Controller 태그:</label>
              <select
                value={targetTag}
                onChange={(e) => setTargetTag(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #009499",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                <option value="분석">분석 (Gemini Pro)</option>
                <option value="문체">문체/교정 (Gemini Flash)</option>
              </select>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "#9ca3af" : "linear-gradient(90deg, #00f6ff 0%, #009499 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {loading ? "분석 중..." : "분석하기"}
            </button>
          </div>
        </div>

        {/* 결과 */}
        <div style={styles.ResultBox}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#009499",
              marginBottom: "15px",
              borderBottom: "1px dashed #009499",
              paddingBottom: "10px",
            }}
          >
            MCP 분석 결과 ({targetTag})
          </h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontSize: "14px",
              color: "#333",
              minHeight: "100px",
              padding: "5px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          >
            {report}
          </pre>

          {canDownload && (
            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  padding: "10px 18px",
                  background: "#009499",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                분석 결과 PDF 다운로드
              </button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ padding: "20px", textAlign: "center", borderTop: "1px solid #eee" }}>
        <div style={{ fontSize: "12px", color: "#777" }}>2025, 명지대학교 공개SW실무 프로젝트 5조</div>
      </footer>
    </div>
  );
}

export default App;
