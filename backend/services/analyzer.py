import os
from openai import OpenAI
from typing import List, Dict, Any
from utils.regex_utils import analyze_line
from models import AnalysisResult, Finding

def calculate_risk(findings: List[Dict[str, Any]]) -> tuple[int, str]:
    score = 0
    for f in findings:
        level = f["risk_level"]
        if level == "critical":
            score += 10
        elif level == "high":
            score += 5
        elif level == "medium":
            score += 3
        elif level == "low":
            score += 1
            
    if score >= 20:
        return score, "critical"
    elif score >= 10:
        return score, "high"
    elif score >= 5:
        return score, "medium"
    return score, "low"

def generate_insights(findings_summary: str) -> tuple[str, List[str]]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your-openai-api-key-here":
        return "AI Analysis disabled (No API Key).", ["Configure OPENAI_API_KEY in backend/.env to enable AI insights."]
        
    try:
        client = OpenAI(api_key=api_key)
        prompt = f"""
        Analyze the following security findings summary from a log file:
        {findings_summary}
        
        Provide a concise overall summary of the log's security posture (1-2 sentences) and a list of key security insights/recommendations (up to 3 points).
        Format the output exactly like this:
        SUMMARY: <your summary>
        INSIGHTS:
        - <insight 1>
        - <insight 2>
        - <insight 3>
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a senior security analyst."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        
        parts = content.split("INSIGHTS:")
        summary_part = parts[0].replace("SUMMARY:", "").strip() if len(parts) > 0 else "Analysis completed."
        insights_part = parts[1].strip() if len(parts) > 1 else ""
        
        insights = [line.lstrip("- ").strip() for line in insights_part.split("\n") if line.strip()]
        
        return summary_part, insights
        
    except Exception as e:
        return f"AI Analysis failed: {str(e)}", ["Ensure OpenAI API is reachable and key is valid."]

def analyze_file_content(content: str) -> AnalysisResult:
    lines = content.splitlines()
    all_findings = []
    
    # Extract findings
    for idx, line in enumerate(lines, start=1):
        findings_in_line = analyze_line(line, idx)
        all_findings.extend(findings_in_line)
        
    # Calculate Risk
    risk_score, risk_level = calculate_risk(all_findings)
    
    # Group findings for AI
    finding_counts = {}
    for f in all_findings:
        finding_counts[f["type"]] = finding_counts.get(f["type"], 0) + 1
        
    findings_summary = ", ".join([f"{count} {ftype}(s)" for ftype, count in finding_counts.items()])
    if not findings_summary:
        findings_summary = "No sensitive data found."
        
    # AI Summary & Insights
    summary, insights = generate_insights(findings_summary)
    
    # Convert back to Pydantic objects
    finding_objects = [Finding(**f) for f in all_findings]
    
    return AnalysisResult(
        summary=summary,
        findings=finding_objects,
        risk_score=risk_score,
        risk_level=risk_level,
        insights=insights
    )
